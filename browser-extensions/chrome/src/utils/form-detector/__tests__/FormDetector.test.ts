import { FormDetector } from '../FormDetector';
import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Helper function to load HTML test files
const loadTestHtml = (filename: string): string => {
  return readFileSync(join(__dirname, 'test-forms', filename), 'utf-8');
};

// Helper function to setup form detection test
const setupFormTest = (htmlFile: string) => {
  const html = loadTestHtml(htmlFile);
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const formDetector = new FormDetector(document);
  const result = formDetector.detectForms()[0];
  return { document, result };
};

enum FormField {
  LastName = 'lastName',
  Email = 'email',
  Password = 'password',
  PasswordConfirm = 'passwordConfirm'
}

// Helper function to test field detection
const testField = (fieldName: FormField, elementId: string, htmlFile: string) => {
  it(`should detect ${fieldName} field`, () => {
    const { document, result } = setupFormTest(htmlFile);
    const fieldKey = `${fieldName}Field` as keyof typeof result;

    expect(result[fieldKey]).toBeDefined();
    expect(result[fieldKey]).toBe(document.getElementById(elementId));
  });
};

describe('FormDetector', () => {
  describe('Dutch registration form detection', () => {
    const htmlFile = 'nl-registration-form1.html';

    testField(FormField.LastName, 'cpContent_txtAchternaam', htmlFile);
    testField(FormField.Email, 'cpContent_txtEmail', htmlFile);
    testField(FormField.Password, 'cpContent_txtWachtwoord', htmlFile);
    testField(FormField.PasswordConfirm, 'cpContent_txtWachtwoord2', htmlFile);
  });
});