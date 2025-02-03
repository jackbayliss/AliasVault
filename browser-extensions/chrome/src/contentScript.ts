import { detectForms } from './utils/FormDetector';
import { Credential } from './types/Credential';
import { IdentityGeneratorEn } from './generators/Identity/implementations/IdentityGeneratorEn';
import { PasswordGenerator } from './generators/Password/PasswordGenerator';

type CredentialResponse = {
  status: 'OK' | 'LOCKED';
  credentials?: Credential[];
}

const placeholderBase64 = 'UklGRjoEAABXRUJQVlA4IC4EAAAwFwCdASqAAIAAPpFCm0olo6Ihp5IraLASCWUA0eb/0s56RrLtCnYfLPiBshdXWMx8j1Ez65f169iA4xUDBTEV6ylMQeCIj2b7RngGi7gKZ9WjKdSoy9R8JcgOmjCMlDmLG20KhNo/i/Dc/Ah5GAvGfm8kfniV3AkR6fxN6eKwjDc6xrDgSfS48G5uGV6WzQt24YAVlLSK9BMwndzfHnePK1KFchFrL7O3ulB8cGNCeomu4o+l0SrS/JKblJ4WTzj0DAD++lCUEouSfgRKdiV2TiYCD+H+l3tANKSPQFPQuzi7rbvxqGeRmXB9kDwURaoSTTpYjA9REMUi9uA6aV7PWtBNXgUzMLowYMZeos6Xvyhb34GmufswMHA5ZyYpxzjTphOak4ZjNOiz8aScO5ygiTx99SqwX/uL+HSeVOSraHw8IymrMwm+jLxqN8BS8dGcItLlm/ioulqH2j4V8glDgSut+ExkxiD7m8TGPrrjCQNJbRDzpOFsyCyfBZupvp8QjGKW2KGziSZeIWes4aTB9tRmeEBhnUrmTDZQuXcc67Fg82KHrSfaeeOEq6jjuUjQ8wUnzM4Zz3dhrwSyslVz/WvnKqYkr4V/TTXPFF5EjF4rM1bHZ8bK63EfTnK41+n3n4gEFoYP4mXkNH0hntnYcdTqiE7Gn+q0BpRRxnkpBSZlA6Wa70jpW0FGqkw5e591A5/H+OV+60WAo+4Mi+NlsKrvLZ9EiVaPnoEFZlJQx1fA777AJ2MjXJ4KSsrWDWJi1lE8yPs8V6XvcC0chDTYt8456sKXAagCZyY+fzQriFMaddXyKQdG8qBqcdYjAsiIcjzaRFBBoOK9sU+sFY7N6B6+xtrlu3c37rQKkI3O2EoiJOris54EjJ5OFuumA0M6riNUuBf/MEPFBVx1JRcUEs+upEBsCnwYski7FT3TTqHrx7v5AjgFN97xhPTkmVpu6sxRnWBi1fxIRp8eWZeFM6mUcGgVk1WeVb1yhdV9hoMo2TsNEPE0tHo/wvuSJSzbZo7wibeXM9v/rRfKcx7X93rfiXVnyQ9f/5CaAQ4lxedPp/6uzLtOS4FyL0bCNeZ6L5w+AiuyWCTDFIYaUzhwfG+/YTQpWyeZCdQIKzhV+3GeXI2cxoP0ER/DlOKymf1gm+zRU3sqf1lBVQ0y+mK/Awl9bS3uaaQmI0FUyUwHUKP7PKuXnO+LcwDv4OfPT6hph8smc1EtMe5ib/apar/qZ9dyaEaElALJ1KKxnHziuvVl8atk1fINSQh7OtXDyqbPw9o/nGIpTnv5iFmwmWJLis2oyEgPkJqyx0vYI8rjkVEzKc8eQavAJBYSpjMwM193Swt+yJyjvaGYWPnqExxKiNarpB2WSO7soCAZXhS1uEYHryrK47BH6W1dRiruqT0xpLih3MXiwU3VDwAAAA==';
const aliasvaultIconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg enable-background="new 0 0 500 500" version="1.1" viewBox="0 0 500 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
<path d="m459.87 294.95c0.016205 5.4005 0.03241 10.801-0.35022 16.873-1.111 6.3392-1.1941 12.173-2.6351 17.649-10.922 41.508-36.731 69.481-77.351 83.408-7.2157 2.4739-14.972 3.3702-22.479 4.995-23.629 0.042205-47.257 0.11453-70.886 0.12027-46.762 0.011322-93.523-0.01416-140.95-0.43411-8.59-2.0024-16.766-2.8352-24.398-5.3326-21.595-7.0666-39.523-19.656-53.708-37.552-10.227-12.903-17.579-27.17-21.28-43.221-1.475-6.3967-2.4711-12.904-3.6852-19.361-0.051849-5.747-0.1037-11.494 0.26915-17.886 4.159-42.973 27.68-71.638 63.562-92.153 0-0.70761-0.001961-1.6988 3.12e-4 -2.69 0.022484-9.8293-1.3071-19.894 0.35664-29.438 3.2391-18.579 11.08-35.272 23.763-49.773 12.098-13.832 26.457-23.989 43.609-30.029 7.813-2.7512 16.14-4.0417 24.234-5.9948 7.392-0.025734 14.784-0.05146 22.835 0.32253 4.1959 0.95392 7.7946 1.2538 11.258 2.1053 17.16 4.2192 32.287 12.176 45.469 24.104 2.2558 2.0411 4.372 6.6241 9.621 3.868 16.839-8.8419 34.718-11.597 53.603-8.594 16.791 2.6699 31.602 9.4308 44.236 20.636 11.531 10.227 19.84 22.841 25.393 37.236 6.3436 16.445 10.389 33.163 6.0798 49.389 7.9587 8.9321 15.807 16.704 22.421 25.414 9.162 12.065 15.33 25.746 18.144 40.776 0.97046 5.1848 1.9111 10.375 2.8654 15.563m-71.597 71.012c5.5615-5.2284 12.002-9.7986 16.508-15.817 10.474-13.992 14.333-29.916 11.288-47.446-2.2496-12.95-8.1973-24.076-17.243-33.063-12.746-12.663-28.865-18.614-46.786-18.569-69.912 0.17712-139.82 0.56831-209.74 0.96176-15.922 0.089599-29.168 7.4209-39.685 18.296-14.45 14.944-20.408 33.343-16.655 54.368 2.2763 12.754 8.2167 23.748 17.158 32.66 13.299 13.255 30.097 18.653 48.728 18.651 59.321-0.005188 118.64 0.042358 177.96-0.046601 9.5912-0.014374 19.181-0.86588 28.773-0.88855 10.649-0.025146 19.978-3.825 29.687-9.1074z" fill="#EEC170"/>
<path d="m162.77 293c15.654 4.3883 20.627 22.967 10.304 34.98-5.3104 6.1795-14.817 8.3208-24.278 5.0472-7.0723-2.4471-12.332-10.362-12.876-17.933-1.0451-14.542 11.089-23.176 21.705-23.046 1.5794 0.019287 3.1517 0.61566 5.1461 0.95184z" fill="#EEC170"/>
<path d="m227.18 293.64c7.8499 2.3973 11.938 8.2143 13.524 15.077 1.8591 8.0439-0.44817 15.706-7.1588 21.121-6.7633 5.4572-14.417 6.8794-22.578 3.1483-8.2972-3.7933-12.836-10.849-12.736-19.438 0.1687-14.497 14.13-25.368 28.948-19.908z" fill="#EEC170"/>
<path d="m261.57 319.07c-2.495-14.418 4.6853-22.603 14.596-26.108 9.8945-3.4995 23.181 3.4303 26.267 13.779 4.6504 15.591-7.1651 29.064-21.665 28.161-8.5254-0.53088-17.202-6.5094-19.198-15.831z" fill="#EEC170"/>
<path d="m336.91 333.41c-9.0175-4.2491-15.337-14.349-13.829-21.682 3.0825-14.989 13.341-20.304 23.018-19.585 10.653 0.79141 17.93 7.407 19.765 17.547 1.9588 10.824-4.1171 19.939-13.494 23.703-5.272 2.1162-10.091 1.5086-15.46 0.017883z" fill="#EEC170"/>
</svg>`;

const DISABLED_SITES_KEY = 'aliasvault_disabled_sites';
const ICON_HTML = `
<div class="aliasvault-input-icon" style="
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 8px;
  top: 8px;
  margin: auto;
  cursor: pointer;
  width: 20px;
  height: 20px;
  z-index: 999999;
">
  <img src="data:image/svg+xml;base64,${btoa(aliasvaultIconSvg)}" style="width: 100%; height: 100%;" />
</div>
`;

/**
 * Check if the current theme is dark.
 */
function isDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Listen for input field focus
 */
document.addEventListener('focusin', async (e) => {
  const target = e.target as HTMLInputElement;
  if (target.tagName === 'INPUT') {
    const isDisabled = await isAutoPopupDisabled();
    if (!isDisabled) {
      showCredentialPopup(target);
    }
  }
});

/**
 * Show credential popup
 */
function showCredentialPopup(input: HTMLInputElement) : void {
  const forms = detectForms();
  if (!forms.length) return;

  // Request credentials from background script
  chrome.runtime.sendMessage({ type: 'GET_CREDENTIALS_FOR_URL', url: window.location.href }, (response: CredentialResponse) => {
    switch (response.status) {
      case 'OK':
        if (response.credentials?.length) {
          createPopup(input, response.credentials);
        }
        break;

      case 'LOCKED':
        createStatusPopup(input, 'AliasVault is locked.');
        break;
    }
  });
}

/**
 * Filter credentials based on current URL and page context
 */
function filterCredentials(credentials: Credential[], currentUrl: string, pageTitle: string): Credential[] {
  // If less than 5 entries, return all
  if (credentials.length <= 5) {
    return credentials;
  }

  const urlObject = new URL(currentUrl);
  const baseUrl = `${urlObject.protocol}//${urlObject.hostname}`;

  // 1. Exact URL match
  let filtered = credentials.filter(cred =>
    cred.ServiceUrl?.toLowerCase() === currentUrl.toLowerCase()
  );

  // 2. Base URL match with fuzzy domain comparison if no exact matches
  if (filtered.length === 0) {
    filtered = credentials.filter(cred => {
        if (!cred.ServiceUrl) return false;
        try {
            const credUrlObject = new URL(cred.ServiceUrl);
            const currentUrlObject = new URL(baseUrl);

            // Extract root domains by splitting on dots and taking last two parts
            const credDomainParts = credUrlObject.hostname.toLowerCase().split('.');
            const currentDomainParts = currentUrlObject.hostname.toLowerCase().split('.');

            // Get root domain (last two parts, e.g., 'dumpert.nl')
            const credRootDomain = credDomainParts.slice(-2).join('.');
            const currentRootDomain = currentDomainParts.slice(-2).join('.');

            // Compare protocols and root domains
            return credUrlObject.protocol === currentUrlObject.protocol &&
                  credRootDomain === currentRootDomain;
        } catch {
            return false;
        }
    });
  }

  // 3. Page title word match if still no matches
  if (filtered.length === 0) {
    const titleWords = pageTitle.toLowerCase().split(/\s+/);
    filtered = credentials.filter(cred =>
      titleWords.some(word =>
        cred.ServiceName.toLowerCase().includes(word)
      )
    );
  }

  return filtered;
}

/**
 * Create auto-fill popup
 */
function createPopup(input: HTMLInputElement, credentials: Credential[]) : void {
  // Remove existing popup if any
  removeExistingPopup();

  const popup = document.createElement('div');
  popup.id = 'aliasvault-credential-popup';

  // Get input width
  const inputWidth = input.offsetWidth;

  // Set popup width to match input width, with min/max constraints
  const popupWidth = Math.max(250, Math.min(960, inputWidth));

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
  `;

  // Filter credentials based on current page context
  const filteredCredentials = filterCredentials(
    credentials,
    window.location.href,
    document.title
  );

  // Add credentials to popup if any matches found
  if (filteredCredentials.length > 0) {
    filteredCredentials.forEach(cred => {
      const item = document.createElement('div');
      item.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      const imgElement = document.createElement('img');
      imgElement.style.width = '16px';
      imgElement.style.height = '16px';

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

      item.appendChild(imgElement);
      item.appendChild(document.createTextNode(cred.Username));

      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = isDarkMode() ? '#374151' : '#f0f0f0';
      });

      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent';
      });

      item.addEventListener('click', () => {
        fillCredential(cred);
        removeExistingPopup();
      });

      popup.appendChild(item);
    });
  } else {
    // Show "no matches found" message
    const noMatches = document.createElement('div');
    noMatches.style.cssText = `
      padding: 8px 16px;
      color: ${isDarkMode() ? '#9ca3af' : '#6b7280'};
      font-style: italic;
    `;
    noMatches.textContent = 'No matches found';
    popup.appendChild(noMatches);
  }

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
    New Alias
  `;
  createButton.addEventListener('click', async () => {
    // TODO: Implement new credential popup if necessary? otherwise remove if simple implementation is sufficient for now.
    // chrome.runtime.sendMessage({ type: 'OPEN_NEW_CREDENTIAL' });
    // removeExistingPopup();

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
      ServiceName: document.title,
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

    chrome.runtime.sendMessage({ type: 'CREATE_IDENTITY', credential });

    // create alert with confirmation message
    alert(`
      New identity created successfully!
      First name: ${identity.firstName}
      Last name: ${identity.lastName}
      Gender: ${identity.gender}
      Email: ${identity.emailPrefix}@${domain}
      Password: ${password}
    `);

    // Refresh the popup to show new identity
    showCredentialPopup(input);
  });

  // Search button
  const searchButton = document.createElement('button');
  searchButton.style.cssText = createButton.style.cssText;
  searchButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    Search
  `;
  searchButton.addEventListener('click', () => {
    // Placeholder for future search functionality
    removeExistingPopup();
  });

  actionContainer.appendChild(createButton);
  actionContainer.appendChild(searchButton);
  popup.appendChild(actionContainer);

  // Add close button to top-right
  const closeButton = document.createElement('button');
  closeButton.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px;
    background: none;
    border: none;
    cursor: pointer;
    color: ${isDarkMode() ? '#9ca3af' : '#6b7280'};
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
    await disableAutoPopup();
    removeExistingPopup();
  });
  popup.appendChild(closeButton);

  /**
   * Add click outside handler
   * @param event
   */
  const handleClickOutside = (event: MouseEvent) : void => {
    if (!popup.contains(event.target as Node)) {
      removeExistingPopup();
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside);
  }, 100);

  // Position popup below input
  const rect = input.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY + 2}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(popup);
}

/**
 * Create status popup. TODO: refactor to use same popup basic structure for all popup types.
 */
function createStatusPopup(input: HTMLInputElement, message: string): void {
  // Remove existing popup if any
  removeExistingPopup();

  const popup = document.createElement('div');
  popup.id = 'aliasvault-credential-popup';

  // Get input width
  const inputWidth = input.offsetWidth;

  // Set popup width to match input width, with min/max constraints
  const popupWidth = Math.max(250, Math.min(960, inputWidth));

  popup.style.cssText = `
    position: absolute;
    z-index: 999999;
    background: ${isDarkMode() ? '#1f2937' : 'white'};
    border: 1px solid ${isDarkMode() ? '#374151' : '#ccc'};
    border-radius: 4px;
    box-shadow: 0 2px 4px ${isDarkMode() ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)'};
    padding: 12px 16px;
    width: ${popupWidth}px;
    color: ${isDarkMode() ? '#f8f9fa' : '#000000'};
    cursor: pointer;
    transition: background-color 0.2s;
  `;

  // Add hover effect to the entire popup
  popup.addEventListener('mouseenter', () => {
    popup.style.backgroundColor = isDarkMode() ? '#374151' : '#f0f0f0';
  });

  popup.addEventListener('mouseleave', () => {
    popup.style.backgroundColor = isDarkMode() ? '#1f2937' : 'white';
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
  `;
  messageElement.textContent = message;
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

  // Make the whole container clickable to open the popup.
  container.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
    removeExistingPopup();
  });

  container.appendChild(button);
  popup.appendChild(container);

  // Position popup below input
  const rect = input.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY + 2}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

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
 * Remove existing popup
 */
function removeExistingPopup() : void {
  const existing = document.getElementById('aliasvault-credential-popup');
  if (existing) {
    existing.remove();
  }
}

/**
 * Fill credential
 */
function fillCredential(credential: Credential) : void {
  const forms = detectForms();
  if (!forms.length) return;

  const form = forms[0];
  if (form.usernameField) {
    form.usernameField.value = credential.Username;
    triggerInputEvents(form.usernameField);
  }
  if (form.passwordField) {
    form.passwordField.value = credential.Password;
    triggerInputEvents(form.passwordField);
  }
}

/**
 * Trigger input events
 */
function triggerInputEvents(element: HTMLInputElement) : void {
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
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

/**
 * Check if auto-popup is disabled for current site
 */
async function isAutoPopupDisabled(): Promise<boolean> {
  const result = await chrome.storage.local.get(DISABLED_SITES_KEY);
  const disabledSites = result[DISABLED_SITES_KEY] || [];
  return disabledSites.includes(window.location.hostname);
}

/**
 * Disable auto-popup for current site
 */
async function disableAutoPopup(): Promise<void> {
  const result = await chrome.storage.local.get(DISABLED_SITES_KEY);
  const disabledSites = result[DISABLED_SITES_KEY] || [];
  if (!disabledSites.includes(window.location.hostname)) {
    disabledSites.push(window.location.hostname);
    await chrome.storage.local.set({ [DISABLED_SITES_KEY]: disabledSites });
  }
}

/**
 * Inject icons into forms
 */
function injectIcons(): void {
  const forms = detectForms();
  forms.forEach(form => {
    // Determine which field to attach the icon to
    const targetField = form.usernameField || form.passwordField;

    if (targetField && !targetField.parentElement?.querySelector('.aliasvault-input-icon')) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position: relative; display: inline-block; width: 100%;';

      // Preserve original input styles
      const computedStyle = window.getComputedStyle(targetField);
      const originalWidth = computedStyle.width;
      const originalDisplay = computedStyle.display;

      targetField.parentNode?.insertBefore(wrapper, targetField);
      wrapper.appendChild(targetField);

      // Restore original input styles
      targetField.style.width = originalWidth;
      targetField.style.display = originalDisplay;

      const iconDiv = document.createElement('div');
      iconDiv.innerHTML = ICON_HTML;
      const icon = iconDiv.firstElementChild as HTMLElement;

      icon.addEventListener('click', () => {
        showCredentialPopup(targetField as HTMLInputElement);
      });

      wrapper.appendChild(icon);
    }
  });
}

// Call injectIcons on page load and DOM mutations
injectIcons();
const observer = new MutationObserver(() => {
  injectIcons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});