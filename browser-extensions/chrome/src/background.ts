import { Buffer } from 'buffer';
import EncryptionUtility from './utils/EncryptionUtility';
import SqliteClient from './utils/SqliteClient';

let vaultState: {
  sessionKey: string | null;
} = {
  sessionKey: null
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'STORE_VAULT': {
      // Generate random session key
      const sessionKey = crypto.getRandomValues(new Uint8Array(32));
      vaultState.sessionKey = Buffer.from(sessionKey).toString('base64');

      // Re-encrypt vault with session key
      (async () : Promise<void> => {
        try {
          const encryptedVault = await EncryptionUtility.symmetricEncrypt(
            message.vault,
            vaultState.sessionKey!
          );

          // Store in chrome.storage.session and wait for completion
          chrome.storage.session.set({ encryptedVault }, () => {
            if (chrome.runtime.lastError) {
              console.error('Failed to store vault:', chrome.runtime.lastError);
              sendResponse({ success: false, error: 'Failed to store vault' });
            } else {
                sendResponse({ success: true });
            }
          });
        } catch (error) {
          console.error('Encryption failed:', error);
          sendResponse({ success: false, error: 'Encryption failed' });
        }
      })();
      break;
    }
    case 'GET_VAULT': {
      if (!vaultState.sessionKey) {
        console.error('No session key available');
        sendResponse({ vault: null });
        return;
      }

      chrome.storage.session.get(['encryptedVault'], async (result) => {
        try {
          if (!result.encryptedVault) {
            console.error('No encrypted vault found in storage');
            sendResponse({ vault: null });
            return;
          }

          // Decrypt vault with session key
          const decryptedVault = await EncryptionUtility.symmetricDecrypt(
            result.encryptedVault,
            vaultState.sessionKey!
          );

          // Parse the decrypted vault and send response
          try {
            sendResponse({ vault: decryptedVault });
          } catch (parseError) {
            console.error('Failed to parse decrypted vault:', parseError);
            sendResponse({ vault: null, error: 'Failed to parse decrypted vault' });
          }
        } catch (decryptError) {
          console.error('Failed to decrypt vault:', decryptError);
          sendResponse({ vault: null, error: 'Failed to decrypt vault' });
        }
      });
      break;
    }
    case 'CLEAR_VAULT': {
      vaultState.sessionKey = null;
      chrome.storage.session.remove(['encryptedVault']);
      sendResponse({ success: true });
      break;
    }

    case 'GET_CREDENTIALS_FOR_URL': {
      if (!vaultState.sessionKey) {
        sendResponse({ credentials: [] });
        return;
      }

      chrome.storage.session.get(['encryptedVault'], async (result) => {
        try {
          if (!result.encryptedVault) {
            sendResponse({ credentials: [] });
            return;
          }

          const decryptedVault = await EncryptionUtility.symmetricDecrypt(
            result.encryptedVault,
            vaultState.sessionKey!
          );

          // Initialize SQLite client
          const sqliteClient = new SqliteClient();
          await sqliteClient.initializeFromBase64(decryptedVault);

          // Query credentials with their related service information
          const credentials = sqliteClient.getAllCredentials();

          // Filter credentials that match the current domain
          /*
           * const matchingCredentials = credentials.filter(cred => {
           * // TODO: Implement proper URL matching
           * return true;
           * try {
           *   const credentialUrl = new URL(cred.ServiceUrl);
           *   return credentialUrl.hostname === url.hostname;
           * } catch {
           *   return false;
           * }
           * });
           *
           * console.log('matchingCredentials:', matchingCredentials);
           */

          sendResponse({ credentials: credentials });
        } catch (error) {
          console.error('Error getting credentials:', error);
          sendResponse({ credentials: [] });
        }
      });
      break;
    }
  }
  return true;
});
