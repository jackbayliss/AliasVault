import { isDarkMode } from './Shared';
import { Credential } from '../types/Credential';
import { fillCredential } from './Form';
import { filterCredentials } from './Filter';
import { IdentityGeneratorEn } from '../generators/Identity/implementations/IdentityGeneratorEn';
import { PasswordGenerator } from '../generators/Password/PasswordGenerator';
import { FormDetector } from '../utils/form-detector/FormDetector';

/**
 * Placeholder base64 image for credentials without a logo.
 */
const placeholderBase64 = 'UklGRjoEAABXRUJQVlA4IC4EAAAwFwCdASqAAIAAPpFCm0olo6Ihp5IraLASCWUA0eb/0s56RrLtCnYfLPiBshdXWMx8j1Ez65f169iA4xUDBTEV6ylMQeCIj2b7RngGi7gKZ9WjKdSoy9R8JcgOmjCMlDmLG20KhNo/i/Dc/Ah5GAvGfm8kfniV3AkR6fxN6eKwjDc6xrDgSfS48G5uGV6WzQt24YAVlLSK9BMwndzfHnePK1KFchFrL7O3ulB8cGNCeomu4o+l0SrS/JKblJ4WTzj0DAD++lCUEouSfgRKdiV2TiYCD+H+l3tANKSPQFPQuzi7rbvxqGeRmXB9kDwURaoSTTpYjA9REMUi9uA6aV7PWtBNXgUzMLowYMZeos6Xvyhb34GmufswMHA5ZyYpxzjTphOak4ZjNOiz8aScO5ygiTx99SqwX/uL+HSeVOSraHw8IymrMwm+jLxqN8BS8dGcItLlm/ioulqH2j4V8glDgSut+ExkxiD7m8TGPrrjCQNJbRDzpOFsyCyfBZupvp8QjGKW2KGziSZeIWes4aTB9tRmeEBhnUrmTDZQuXcc67Fg82KHrSfaeeOEq6jjuUjQ8wUnzM4Zz3dhrwSyslVz/WvnKqYkr4V/TTXPFF5EjF4rM1bHZ8bK63EfTnK41+n3n4gEFoYP4mXkNH0hntnYcdTqiE7Gn+q0BpRRxnkpBSZlA6Wa70jpW0FGqkw5e591A5/H+OV+60WAo+4Mi+NlsKrvLZ9EiVaPnoEFZlJQx1fA777AJ2MjXJ4KSsrWDWJi1lE8yPs8V6XvcC0chDTYt8456sKXAagCZyY+fzQriFMaddXyKQdG8qBqcdYjAsiIcjzaRFBBoOK9sU+sFY7N6B6+xtrlu3c37rQKkI3O2EoiJOris54EjJ5OFuumA0M6riNUuBf/MEPFBVx1JRcUEs+upEBsCnwYski7FT3TTqHrx7v5AjgFN97xhPTkmVpu6sxRnWBi1fxIRp8eWZeFM6mUcGgVk1WeVb1yhdV9hoMo2TsNEPE0tHo/wvuSJSzbZo7wibeXM9v/rRfKcx7X93rfiXVnyQ9f/5CaAQ4lxedPp/6uzLtOS4FyL0bCNeZ6L5w+AiuyWCTDFIYaUzhwfG+/YTQpWyeZCdQIKzhV+3GeXI2cxoP0ER/DlOKymf1gm+zRU3sqf1lBVQ0y+mK/Awl9bS3uaaQmI0FUyUwHUKP7PKuXnO+LcwDv4OfPT6hph8smc1EtMe5ib/apar/qZ9dyaEaElALJ1KKxnHziuvVl8atk1fINSQh7OtXDyqbPw9o/nGIpTnv5iFmwmWJLis2oyEgPkJqyx0vYI8rjkVEzKc8eQavAJBYSpjMwM193Swt+yJyjvaGYWPnqExxKiNarpB2WSO7soCAZXhS1uEYHryrK47BH6W1dRiruqT0xpLih3MXiwU3VDwAAAA==';

/**
 * Create basic popup with default style.
 */
export function createBasePopup(input: HTMLInputElement) : HTMLElement {
    // Remove existing popup and its event listeners
    removeExistingPopup();

    const popup = document.createElement('div');
    popup.id = 'aliasvault-credential-popup';

    // Get input width
    const inputWidth = input.offsetWidth;

    // Set popup width to match input width, with min/max constraints
    const popupWidth = Math.max(360, Math.min(640, inputWidth));

    popup.style.cssText = `
        position: absolute;
        z-index: 999999;
        background: ${isDarkMode() ? '#1f2937' : 'white'};
        border: 1px solid ${isDarkMode() ? '#374151' : '#ccc'};
        border-radius: 4px;
        box-shadow: 0 2px 4px ${isDarkMode() ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)'};
        padding: 8px 0;
        width: ${popupWidth}px;
        color: ${isDarkMode() ? '#f8f9fa' : '#000000'};
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    `;

    // Position popup below input
    const rect = input.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 2}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;

    return popup;
}

/**
 * Create a loading popup.
 */
export function createLoadingPopup(input: HTMLInputElement, message: string) : HTMLElement {
    const getLoadingHtml = (message: string): string => `
<div style="
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
">
  <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
    <path d="M12 2C6.47715 2 2 6.47715 2 12" stroke-opacity="1"/>
  </svg>
  <span>${message}</span>
</div>
`;

    const popup = createBasePopup(input);
    popup.innerHTML = getLoadingHtml(message);

    document.body.appendChild(popup);
    return popup;
}

/**
 * Update the credential list content in the popup.
 */
export function updatePopupContent(credentials: Credential[], credentialList: HTMLElement | null) : void {
    if (!credentialList) {
      credentialList = document.getElementById('aliasvault-credential-list') as HTMLElement;
    }

    if (!credentialList) return;

    // Clear existing content
    credentialList.innerHTML = '';

    // Add credentials using the shared function
    const credentialElements = createCredentialList(credentials);
    credentialElements.forEach(element => credentialList.appendChild(element));
}

/**
 * Remove existing popup (if any exists).
 */
export function removeExistingPopup() : void {
    const existing = document.getElementById('aliasvault-credential-popup');
    if (existing) {
      // Remove the mousedown event listener before removing the popup
      // TODO: remove if not needed
      //document.removeEventListener('mousedown', handleClickOutside);
      existing.remove();
    }
  }

/**
 * Create auto-fill popup
 */
export function createAutofillPopup(input: HTMLInputElement, credentials: Credential[]) : void {
  const popup = createBasePopup(input);

  // Create credential list container with ID
  const credentialList = document.createElement('div');
  credentialList.id = 'aliasvault-credential-list';
  popup.appendChild(credentialList);

  // Add initial credentials
  const filteredCredentials = filterCredentials(
    credentials,
    window.location.href,
    document.title
  );
  updatePopupContent(filteredCredentials, credentialList);

  // Add divider
  const divider = document.createElement('div');
  divider.style.cssText = `
    height: 1px;
    background: ${isDarkMode() ? '#374151' : '#e5e7eb'};
    margin: 8px 0;
  `;
  popup.appendChild(divider);

  // Add action buttons container
  const actionContainer = document.createElement('div');
  actionContainer.style.cssText = `
    display: flex;
    gap: 8px;
    padding: 8px 16px;
  `;

  // Create New button
  const createButton = document.createElement('button');
  createButton.style.cssText = `
    flex: 1;
    padding: 6px 12px;
    border-radius: 4px;
    background: ${isDarkMode() ? '#374151' : '#f3f4f6'};
    color: ${isDarkMode() ? '#e5e7eb' : '#374151'};
    font-size: 14px;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  `;
  createButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    New
  `;

  createButton.addEventListener('click', async () => {
    const serviceName = await createEditNamePopup(document.title);
    if (!serviceName) return; // User cancelled

    const loadingPopup = createLoadingPopup(input, 'Creating new identity...');

    try {
      // Retrieve default email domain from background
      const response = await new Promise<{ domain: string }>((resolve) => {
        chrome.runtime.sendMessage({ type: 'GET_DEFAULT_EMAIL_DOMAIN' }, resolve);
      });

      const domain = response.domain;

      // Generate new identity locally
      const identityGenerator = new IdentityGeneratorEn();
      const identity = await identityGenerator.generateRandomIdentity();

      const passwordGenerator = new PasswordGenerator();
      const password = passwordGenerator.generateRandomPassword();

      // Extract favicon from page and get the bytes
      const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]') as HTMLLinkElement;
      let faviconBytes: ArrayBuffer | null = null;

      if (favicon?.href) {
        try {
          const response = await fetch(favicon.href);
          faviconBytes = await response.arrayBuffer();
        } catch (error) {
          console.error('Error fetching favicon:', error);
        }
      }

      // Submit new identity to backend to persist in db
      const credential: Credential = {
        Id: '',
        ServiceName: serviceName,
        ServiceUrl: window.location.href,
        Email: `${identity.emailPrefix}@${domain}`,
        Logo: faviconBytes ? new Uint8Array(faviconBytes) : undefined,
        Username: identity.nickName,
        Password: password,
        Notes: '',
        Alias: {
          FirstName: identity.firstName,
          LastName: identity.lastName,
          NickName: identity.nickName,
          BirthDate: identity.birthDate.toISOString(),
          Gender: identity.gender,
          Email: `${identity.emailPrefix}@${domain}`
        }
      };

      chrome.runtime.sendMessage({ type: 'CREATE_IDENTITY', credential }, () => {
        // Refresh the popup to show new identity
        openAutofillPopup(input);
      });
    } catch (error) {
      console.error('Error creating identity:', error);
      loadingPopup.innerHTML = `
        <div style="padding: 16px; color: #ef4444;">
          Failed to create identity. Please try again.
        </div>
      `;
      setTimeout(() => {
        removeExistingPopup();
      }, 2000);
    }
  });

  // Create search input instead of button
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.dataset.aliasvaultIgnore = 'true';
  searchInput.placeholder = 'Search vault...';
  searchInput.style.cssText = `
    flex: 2;
    padding: 6px 12px;
    border-radius: 4px;
    background: ${isDarkMode() ? '#374151' : '#f3f4f6'};
    color: ${isDarkMode() ? '#e5e7eb' : '#374151'};
    font-size: 14px;
    border: 1px solid ${isDarkMode() ? '#4b5563' : '#e5e7eb'};
    outline: none;
  `;

  // Add focus styles
  searchInput.addEventListener('focus', () => {
    searchInput.style.borderColor = '#2563eb';
    searchInput.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.2)';
  });

  searchInput.addEventListener('blur', () => {
    searchInput.style.borderColor = isDarkMode() ? '#4b5563' : '#e5e7eb';
    searchInput.style.boxShadow = 'none';
  });

  // Handle search input
  let searchTimeout: NodeJS.Timeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const searchTerm = searchInput.value.toLowerCase();

    type CredentialResponse = {
        status: 'OK' | 'LOCKED';
        credentials?: Credential[];
      }

    // Request credentials from background script
    chrome.runtime.sendMessage({ type: 'GET_CREDENTIALS_FOR_URL', url: window.location.href }, (response: CredentialResponse) => {
      if (response.status === 'OK' && response.credentials) {
        let filteredCredentials;

        if (searchTerm === '') {
          // If search is empty, use original URL-based filtering
          filteredCredentials = filterCredentials(
            response.credentials,
            window.location.href,
            document.title
          );
        } else {
          // Otherwise filter based on search term
          filteredCredentials = response.credentials.filter(cred =>
            cred.ServiceName.toLowerCase().includes(searchTerm) ||
            cred.Username.toLowerCase().includes(searchTerm) ||
            cred.Email.toLowerCase().includes(searchTerm) ||
            cred.ServiceUrl?.toLowerCase().includes(searchTerm)
          );

          // Show max 3 results for search
          if (filteredCredentials.length > 3) {
            filteredCredentials = filteredCredentials.slice(0, 3);
          }
        }

        // Update popup content with filtered results
        updatePopupContent(filteredCredentials, credentialList);
      }
    });
  });

  // Close button
  const closeButton = document.createElement('button');
  closeButton.style.cssText = `
    padding: 6px;
    border-radius: 4px;
    background: ${isDarkMode() ? '#374151' : '#f3f4f6'};
    color: ${isDarkMode() ? '#e5e7eb' : '#374151'};
    font-size: 14px;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  closeButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;
  closeButton.addEventListener('click', async () => {
    await disableAutoShowPopup();
    removeExistingPopup();
  });

  actionContainer.appendChild(searchInput);
  actionContainer.appendChild(createButton);
  actionContainer.appendChild(closeButton);
  popup.appendChild(actionContainer);

  // Define handleClickOutside
  const handleClickOutside = (event: MouseEvent) : void => {
    const popup = document.getElementById('aliasvault-credential-popup');
    const target = event.target as Node;

    // If popup doesn't exist, remove the listener
    if (!popup) {
      document.removeEventListener('mousedown', handleClickOutside);
      return;
    }

    // Ignore clicks on the popup and its children
    if (popup.contains(target)) {
      return;
    }

    // Check if click target is an input field
    const inputFields = document.querySelectorAll('input');
    for (const input of inputFields) {
      if (input.contains(target)) {
        return;
      }
    }

    removeExistingPopup();
  };

  // Add the event listener for clicking outside
  document.addEventListener('mousedown', handleClickOutside);

  document.body.appendChild(popup);
}

/**
 * Create vault locked popup.
 */
export function createVaultLockedPopup(input: HTMLInputElement): void {
  const popup = createBasePopup(input);

  // Adjust popup css
  popup.style.padding = '12px 16px';
  popup.style.cursor = 'pointer';

  // Add hover effect to the entire popup
  popup.addEventListener('mouseenter', () => {
    popup.style.backgroundColor = isDarkMode() ? '#374151' : '#f0f0f0';
  });

  popup.addEventListener('mouseleave', () => {
    popup.style.backgroundColor = isDarkMode() ? '#1f2937' : 'white';
  });

  // Make the whole popup clickable to open the main extension login popup.
  popup.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
    removeExistingPopup();
  });

  // Create container for message and button
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    align-items: center;
    position: relative;
  `;

  // Add message
  const messageElement = document.createElement('div');
  messageElement.style.cssText = `
    color: ${isDarkMode() ? '#d1d5db' : '#666'};
    font-size: 14px;
    padding-right: 32px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
  `;
  messageElement.textContent = 'AliasVault is locked.';
  container.appendChild(messageElement);

  // Add unlock button with SVG icon
  const button = document.createElement('button');
  button.title = 'Unlock AliasVault';
  button.style.cssText = `
    position: absolute;
    right: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0066cc;
    border-radius: 4px;
  `;
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `;

  container.appendChild(button);
  popup.appendChild(container);

  /**
   * Add event listener to document to close popup when clicking outside.
   */
  const handleClickOutside = (event: MouseEvent): void => {
    if (!popup.contains(event.target as Node)) {
      removeExistingPopup();
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside);
  }, 100);

  document.body.appendChild(popup);
}

  /**
 * Create credential list content for popup
 */
function createCredentialList(credentials: Credential[]): HTMLElement[] {
    const elements: HTMLElement[] = [];

    if (credentials.length > 0) {
      credentials.forEach(cred => {
        const item = document.createElement('div');
        item.style.cssText = `
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          transition: background-color 0.2s ease;
          border-radius: 4px;
          margin: 0 4px;
        `;

        // Create container for credential info (logo + username)
        const credentialInfo = document.createElement('div');
        credentialInfo.style.cssText = `
          display: flex;
          align-items: center;
          gap: 16px;
          flex-grow: 1;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        `;

        const imgElement = document.createElement('img');
        imgElement.style.width = '20px';
        imgElement.style.height = '20px';

        // Handle base64 image data
        if (cred.Logo) {
          try {
            const base64Logo = base64Encode(cred.Logo);
            imgElement.src = `data:image/x-icon;base64,${base64Logo}`;
          } catch (error) {
            console.error('Error setting logo:', error);
            imgElement.src = `data:image/x-icon;base64,${placeholderBase64}`;
          }
        } else {
          imgElement.src = `data:image/x-icon;base64,${placeholderBase64}`;
        }

        credentialInfo.appendChild(imgElement);
        const credTextContainer = document.createElement('div');
        credTextContainer.style.cssText = `
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          min-width: 0; /* Enable text truncation in flex container */
        `;

        // Service name (primary text)
        const serviceName = document.createElement('div');
        serviceName.style.cssText = `
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          font-size: 14px;
          text-overflow: ellipsis;
          color: ${isDarkMode() ? '#f3f4f6' : '#111827'};
        `;
        serviceName.textContent = cred.ServiceName;

        // Details container (secondary text)
        const detailsContainer = document.createElement('div');
        detailsContainer.style.cssText = `
          font-size: 0.85em;
          white-space: nowrap;
          overflow: hidden;
          font-size: 12px;
          text-overflow: ellipsis;
          color: ${isDarkMode() ? '#9ca3af' : '#6b7280'};
        `;

        // Combine full name (if available) and username
        const details = [];
        if (cred.Alias?.FirstName && cred.Alias?.LastName) {
          details.push(`${cred.Alias.FirstName} ${cred.Alias.LastName}`);
        }
        details.push(cred.Username);
        detailsContainer.textContent = details.join(' · ');

        credTextContainer.appendChild(serviceName);
        credTextContainer.appendChild(detailsContainer);
        credentialInfo.appendChild(credTextContainer);

        // Add popout icon
        const popoutIcon = document.createElement('div');
        popoutIcon.style.cssText = `
          display: flex;
          align-items: center;
          padding: 4px;
          opacity: 0.6;
          border-radius: 4px;
        `;
        popoutIcon.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        `;

        // Add hover effects
        popoutIcon.addEventListener('mouseenter', () => {
          popoutIcon.style.opacity = '1';
          popoutIcon.style.backgroundColor = isDarkMode() ? '#ffffff' : '#000000';
          popoutIcon.style.color = isDarkMode() ? '#000000' : '#ffffff';
        });

        popoutIcon.addEventListener('mouseleave', () => {
          popoutIcon.style.opacity = '0.6';
          popoutIcon.style.backgroundColor = 'transparent';
          popoutIcon.style.color = isDarkMode() ? '#ffffff' : '#000000';
        });

        // Handle popout click
        popoutIcon.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent credential fill
          chrome.runtime.sendMessage({
            type: 'OPEN_POPUP_WITH_CREDENTIAL',
            credentialId: cred.Id
          });
          removeExistingPopup();
        });

        item.appendChild(credentialInfo);
        item.appendChild(popoutIcon);

        // Update hover effect for the entire item
        item.addEventListener('mouseenter', () => {
          item.style.backgroundColor = isDarkMode() ? '#2d3748' : '#f3f4f6';
          popoutIcon.style.opacity = '1';
        });

        item.addEventListener('mouseleave', () => {
          item.style.backgroundColor = 'transparent';
          popoutIcon.style.opacity = '0.6';
        });

        // Update click handler to only trigger on credentialInfo
        credentialInfo.addEventListener('click', () => {
          fillCredential(cred);
          removeExistingPopup();
        });

        elements.push(item);
      });
    } else {
      const noMatches = document.createElement('div');
      noMatches.style.cssText = `
        padding: 8px 16px;
        color: ${isDarkMode() ? '#9ca3af' : '#6b7280'};
        font-style: italic;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      `;
      noMatches.textContent = 'No matches found';
      elements.push(noMatches);
    }

    return elements;
  }

  const DISABLED_SITES_KEY = 'aliasvault_disabled_sites';


  /**
 * Check if auto-popup is disabled for current site
 */
export async function isAutoShowPopupDisabled(): Promise<boolean> {
    const result = await chrome.storage.local.get(DISABLED_SITES_KEY);
    const disabledSites = result[DISABLED_SITES_KEY] || [];
    return disabledSites.includes(window.location.hostname);
  }

  /**
   * Disable auto-popup for current site
   */
  export async function disableAutoShowPopup(): Promise<void> {
    const result = await chrome.storage.local.get(DISABLED_SITES_KEY);
    const disabledSites = result[DISABLED_SITES_KEY] || [];
    if (!disabledSites.includes(window.location.hostname)) {
      disabledSites.push(window.location.hostname);
      await chrome.storage.local.set({ [DISABLED_SITES_KEY]: disabledSites });
    }
  }

    /**
 * Create edit name popup. Part of the "create new alias" flow.
 */
export async function createEditNamePopup(defaultName: string): Promise<string | null> {
    // Close existing popup
    removeExistingPopup();

    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const popup = document.createElement('div');
      popup.style.cssText = `
        position: relative;
        z-index: 1000000;
        background: ${isDarkMode() ? '#1f2937' : 'white'};
        border: 1px solid ${isDarkMode() ? '#374151' : '#ccc'};
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06),
                    0 20px 25px -5px rgba(0, 0, 0, 0.1);
        padding: 24px;
        width: 400px;
        max-width: 90vw;
        transform: scale(0.95);
        opacity: 0;
        transition: transform 0.2s ease, opacity 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      `;

      popup.innerHTML = `
        <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: ${isDarkMode() ? '#f8f9fa' : '#000000'}">
          New alias name
        </h3>
        <input
          type="text"
          id="service-name-input"
          data-aliasvault-ignore="true"
          value="${defaultName}"
          style="
            width: 100%;
            padding: 8px 12px;
            margin-bottom: 24px;
            border: 1px solid ${isDarkMode() ? '#374151' : '#ccc'};
            border-radius: 6px;
            background: ${isDarkMode() ? '#374151' : 'white'};
            color: ${isDarkMode() ? '#f8f9fa' : '#000000'};
            font-size: 14px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          "
        >
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button id="cancel-btn" style="
            padding: 8px 16px;
            border-radius: 6px;
            border: 1px solid ${isDarkMode() ? '#374151' : '#e5e7eb'};
            background: transparent;
            color: ${isDarkMode() ? '#f8f9fa' : '#000000'};
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
          ">Cancel</button>
          <button id="save-btn" style="
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            background: #2563eb;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
          ">Save</button>
        </div>
      `;

      overlay.appendChild(popup);
      document.body.appendChild(overlay);

      // Add hover and focus styles
      const input = popup.querySelector('#service-name-input') as HTMLInputElement;
      const saveBtn = popup.querySelector('#save-btn') as HTMLButtonElement;
      const cancelBtn = popup.querySelector('#cancel-btn') as HTMLButtonElement;

      input.addEventListener('focus', () => {
        input.style.borderColor = '#2563eb';
        input.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
      });

      input.addEventListener('blur', () => {
        input.style.borderColor = isDarkMode() ? '#374151' : '#ccc';
        input.style.boxShadow = 'none';
      });

      saveBtn.addEventListener('mouseenter', () => {
        saveBtn.style.background = '#1d4ed8';
        saveBtn.style.transform = 'translateY(-1px)';
      });

      saveBtn.addEventListener('mouseleave', () => {
        saveBtn.style.background = '#2563eb';
        saveBtn.style.transform = 'translateY(0)';
      });

      cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = isDarkMode() ? '#374151' : '#f3f4f6';
      });

      cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'transparent';
      });

      // Animate in
      requestAnimationFrame(() => {
        popup.style.transform = 'scale(1)';
        popup.style.opacity = '1';
      });

      // Select input text
      input.select();

      // Add variable to track if text is being selected
      let isSelecting = false;

      // Add mousedown handler to input
      input.addEventListener('mousedown', () => {
        isSelecting = true;
      });

      // Add mouseup handler to document
      document.addEventListener('mouseup', () => {
        // Use setTimeout to ensure click handler runs after mouseup
        setTimeout(() => {
          isSelecting = false;
        }, 0);
      });

      const closePopup = (value: string | null) => {
        popup.style.transform = 'scale(0.95)';
        popup.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          resolve(value);
        }, 200);
      };

      // Handle save
      saveBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {
          closePopup(value);
        }
      });

      // Handle cancel
      cancelBtn.addEventListener('click', () => {
        closePopup(null);
      });

      // Handle Enter key
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const value = input.value.trim();
          if (value) {
            closePopup(value);
          }
        }
      });

      // Handle click outside
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          // Check if there's any text selected in the input
          const selectedText = input.value.substring(input.selectionStart || 0, input.selectionEnd || 0);

          // Only close if no text is selected
          if (!selectedText) {
            closePopup(null);
          }
        }
      });
    });
  };

  /**
 * Open (or refresh) the autofill popup including check if vault is locked.
 */
export function openAutofillPopup(input: HTMLInputElement) : void {
    const formDetector = new FormDetector(document);
    const forms = formDetector.detectForms();

    if (!forms.length) return;

    // Add keydown event listener for Enter key
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        removeExistingPopup();
        // Remove the event listener to clean up
        document.removeEventListener('keydown', handleEnterKey);
      }
    };
    document.addEventListener('keydown', handleEnterKey);

    // Request credentials from background script
    chrome.runtime.sendMessage({ type: 'GET_CREDENTIALS_FOR_URL', url: window.location.href }, (response: CredentialResponse) => {
      switch (response.status) {
        case 'OK':
          if (response.credentials?.length) {
            createAutofillPopup(input, response.credentials);
          }
          break;

        case 'LOCKED':
          createVaultLockedPopup(input);
          break;
      }
    });
  }

/**
 * Base64 encode binary data.
 */
function base64Encode(buffer: Uint8Array): string | null {
    if (!buffer || typeof buffer !== 'object') {
        return null;
    }

    try {
        // Convert object to array of numbers
        const byteArray = Object.values(buffer);

        // Convert to binary string
        const binary = String.fromCharCode.apply(null, byteArray as number[]);

        // Use btoa to encode binary string to base64
        return btoa(binary);
    } catch (error) {
        console.error('Error encoding to base64:', error);
        return null;
    }
  }