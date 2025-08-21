import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SignUpPage extends BasePage {
  readonly emailInput: Locator;
  readonly password1Input: Locator;
  readonly password2Input: Locator;
  readonly signUpButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form elements
    this.emailInput = page.locator('#id_email');
    this.password1Input = page.locator('#id_password1');
    this.password2Input = page.locator('#id_password2');
    this.signUpButton = page.locator('button[type="submit"]');
    
    // Page content
    this.pageTitle = page.getByRole('heading', { name: 'Sign Up' });
  }

  /**
   * Navigate to the sign-up page
   */
  async goto() {
    await this.page.goto('/accounts/signup/');
  }

  /**
   * Fill in the sign-up form
   */
  async fillSignUpForm(email: string, password1: string, password2: string) {
    await this.emailInput.fill(email);
    await this.password1Input.fill(password1);
    await this.password2Input.fill(password2);
  }

  /**
   * Submit the sign-up form
   */
  async submit() {
    await this.signUpButton.click();
  }

  /**
   * Complete sign-up process
   */
  async signUp(email: string, password1: string, password2: string) {
    await this.fillSignUpForm(email, password1, password2);
    await this.submit();
  }

  /**
   * Verify the page is loaded correctly
   */
  async expectPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.password1Input).toBeVisible();
    await expect(this.password2Input).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
  }

  /**
   * Check if user is on the sign-up page
   */
  async expectToBeOnSignUpPage() {
    await super.expectToBeOnSignupPage();
    await expect(this.pageTitle).toHaveText('Sign Up');
  }



  /**
   * Get field validation errors for a specific field
   */
  async getFieldErrors(fieldName: string): Promise<string[]> {
    const fieldErrors = this.page.locator(`#div_id_${fieldName} .invalid-feedback`);
    const count = await fieldErrors.count();
    const errors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const errorText = await fieldErrors.nth(i).textContent();
      if (errorText) {
        errors.push(errorText);
      }
    }
    
    return errors;
  }

  /**
   * Check if field has specific validation error
   */
  async expectFieldError(fieldName: string, expectedError: string) {
    const errors = await this.getFieldErrors(fieldName);
    const hasError = errors.some(error => error.includes(expectedError));
    expect(hasError).toBe(true);
  }

  /**
   * Check if field has no validation errors
   */
  async expectNoFieldError(fieldName: string) {
    const fieldErrors = this.page.locator(`#div_id_${fieldName} .invalid-feedback`);
    await expect(fieldErrors).not.toBeVisible();
  }

  /**
   * Check if field has validation errors (any)
   */
  async expectFieldHasErrors(fieldName: string) {
    const fieldErrors = this.page.locator(`#div_id_${fieldName} .invalid-feedback`);
    await expect(fieldErrors.first()).toBeVisible();
  }
}
