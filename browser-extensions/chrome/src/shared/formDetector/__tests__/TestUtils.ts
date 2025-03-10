import { FormDetector } from '../FormDetector';
import { readFileSync } from 'fs';
import { join } from 'path';
import { it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { FormFields } from '../types/FormFields';

export enum FormField {
  Username = 'username',
  FirstName = 'firstName',
  LastName = 'lastName',
  FullName = 'fullName',
  Email = 'email',
  EmailConfirm = 'emailConfirm',
  Password = 'password',
  PasswordConfirm = 'passwordConfirm',
  BirthDate = 'birthdate',
  BirthDateFormat = 'birthdateFormat',
  BirthDay = 'birthdateDay',
  BirthMonth = 'birthdateMonth',
  BirthYear = 'birthdateYear',
  Gender = 'gender',
  GenderMale = 'genderMale',
  GenderFemale = 'genderFemale',
  GenderOther = 'genderOther'
}

/**
 * Create a JSDOM instance for a test HTML file that can be used to provide as
 * input to the form detector logic.
 */
export const createTestDom = (htmlFile: string) : JSDOM => {
  const html = loadTestHtml(htmlFile);
  return new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable'
  });
};

/**
 * Helper function to test field detection
 */
export const testField = (fieldName: FormField, elementId: string, htmlFile: string) : void => {
  it(`should detect ${fieldName} field`, () => {
    const { document, result } = setupFormTest(htmlFile, elementId);

    // First verify the test element exists
    const expectedElement = document.getElementById(elementId);
    if (!expectedElement) {
      throw new Error(`Test setup failed: Element with id "${elementId}" not found in test HTML. Check if the element is present in the test HTML file: ${htmlFile}`);
    }

    // Handle birthdate fields differently
    if (fieldName === FormField.BirthDate) {
      expect(result.birthdateField.single).toBe(expectedElement);
    } else if (fieldName === FormField.BirthDay) {
      expect(result.birthdateField.day).toBe(expectedElement);
    } else if (fieldName === FormField.BirthMonth) {
      expect(result.birthdateField.month).toBe(expectedElement);
    } else if (fieldName === FormField.BirthYear) {
      expect(result.birthdateField.year).toBe(expectedElement);
    // Handle gender field differently
    } else if (fieldName === FormField.Gender) {
      expect(result.genderField.field).toBe(expectedElement);
    } else if (fieldName === FormField.GenderMale) {
      expect(result.genderField.radioButtons?.male).toBe(expectedElement);
    } else if (fieldName === FormField.GenderFemale) {
      expect(result.genderField.radioButtons?.female).toBe(expectedElement);
    } else if (fieldName === FormField.GenderOther) {
      expect(result.genderField.radioButtons?.other).toBe(expectedElement);
    // Handle default fields
    } else {
      const fieldKey = `${fieldName}Field` as keyof typeof result;
      expect(result[fieldKey]).toBeDefined();
      expect(result[fieldKey]).toBe(expectedElement);
    }
  });
};

/**
 * Test the birthdate format.
 */
export const testBirthdateFormat = (expectedFormat: string, htmlFile: string, focusedElementId: string) : void => {
  it('should detect correct birthdate format', () => {
    const { result } = setupFormTest(htmlFile, focusedElementId);
    expect(result.birthdateField.format).toBe(expectedFormat);
  });
};

/**
 * Load a test HTML file.
 */
const loadTestHtml = (filename: string): string => {
  return readFileSync(join(__dirname, 'test-forms', filename), 'utf-8');
};

/**
 * Set up a form detection test.
 */
const setupFormTest = (htmlFile: string, focusedElementId: string) : { document: Document, result: FormFields | null } => {
  const html = loadTestHtml(htmlFile);
  const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable'
  });
  const document = dom.window.document;

  // Set focus on specified element if provided
  let focusedElement = document.getElementById(focusedElementId);
  if (!focusedElement) {
    throw new Error(`Focus element with id "${focusedElementId}" not found in test HTML`);
  }

  // Create a new form detector with the focused element.
  const formDetector = new FormDetector(document, focusedElement);
  const result = formDetector.getForm();
  return { document, result };
};
