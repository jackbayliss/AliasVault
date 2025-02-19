import { FormDetector } from './src/shared/formDetector/FormDetector';
import { isAutoShowPopupDisabled, openAutofillPopup, removeExistingPopup } from './src/contentScript/Popup';
import { canShowPopup, injectIcon } from './src/contentScript/Form';

/**
 * Listen for input field focus
 */
document.addEventListener('focusin', async (e) => {
  const target = e.target as HTMLInputElement;
  const textInputTypes = ['text', 'email', 'tel', 'password', 'search', 'url'];

  if (target.tagName === 'INPUT' &&
      textInputTypes.includes(target.type) &&
      !target.dataset.aliasvaultIgnore) {
    const formDetector = new FormDetector(document, target);
    const forms = formDetector.detectForms();

    if (!forms.length) return;

    injectIcon(target);

    const isDisabled = await isAutoShowPopupDisabled();
    const canShow = canShowPopup();

    // Only show popup if it's not disabled and the popup can be shown (not blocked by debounce)
    if (!isDisabled && canShow) {
      openAutofillPopup(target);
    }
  }
});

// Also listen for popstate events (back/forward navigation)
window.addEventListener('popstate', () => {
  removeExistingPopup();
});