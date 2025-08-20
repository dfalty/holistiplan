import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SignupPage extends BasePage {
  readonly emailInput: Locator;
  readonly password1Input: Locator;
  readonly password2Input: Locator;
  readonly signUpButton: Locator;
  readonly signInLink: Locator;
  readonly pageTitle: Locator;
  readonly errorMessage: Locator;
  readonly passwordHelpText: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form elements
    this.emailInput = page.getByLabel('Email');
    this.password1Input = page.getByLabel('Password');
    this.password2Input = page.getByLabel('Password (again)');
    this.signUpButton = page.getByRole('button', { name: 'Sign Up »' });
    this.signInLink = page.getByRole('link', { name: 'sign in' });
    
    // Page content
    this.pageTitle = page.getByRole('heading', { name: 'Sign Up' });
    this.errorMessage = page.getByRole('alert');
    this.passwordHelpText = page.locator('#id_password1_helptext');
  }

  /**
   * Navigate to the signup page
   */
  async goto() {
    await this.page.goto('/accounts/signup/');
  }

  /**
   * Fill in the signup form
   */
  async fillSignupForm(email: string, password1: string, password2: string) {
    await this.emailInput.fill(email);
    await this.password1Input.fill(password1);
    await this.password2Input.fill(password2);
  }

  /**
   * Submit the signup form
   */
  async submit() {
    await this.signUpButton.click();
  }

  /**
   * Complete signup process
   */
  async signup(email: string, password1: string, password2: string) {
    await this.fillSignupForm(email, password1, password2);
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
    await expect(this.passwordHelpText).toBeVisible();
  }

  /**
   * Check if user is on the signup page
   */
  async expectToBeOnSignupPage() {
    await super.expectToBeOnSignupPage();
    await expect(this.pageTitle).toHaveText('Sign Up');
  }

  /**
   * Check if error message is displayed
   */
  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  /**
   * Check if error message is not displayed
   */
  async expectNoErrorMessage() {
    await expect(this.errorMessage).not.toBeVisible();
  }

  /**
   * Verify password help text is displayed
   */
  async expectPasswordHelpText() {
    await expect(this.passwordHelpText).toBeVisible();
    await expect(this.passwordHelpText).toContainText('Your password can\'t be too similar to your other personal information.');
    await expect(this.passwordHelpText).toContainText('Your password must contain at least 8 characters.');
    await expect(this.passwordHelpText).toContainText('Your password can\'t be a commonly used password.');
    await expect(this.passwordHelpText).toContainText('Your password can\'t be entirely numeric.');
  }

  /**
   * Check form labels and placeholders
   */
  async expectFormLabels() {
    // Email field
    await expect(this.page.getByText('Email')).toBeVisible();
    await expect(this.emailInput).toHaveAttribute('placeholder', 'Email address');
    await expect(this.emailInput).toHaveAttribute('type', 'email');
    await expect(this.emailInput).toHaveAttribute('required');

    // Password1 field
    await expect(this.page.getByText('Password')).toBeVisible();
    await expect(this.password1Input).toHaveAttribute('placeholder', 'Password');
    await expect(this.password1Input).toHaveAttribute('type', 'password');
    await expect(this.password1Input).toHaveAttribute('required');

    // Password2 field
    await expect(this.page.getByText('Password (again)')).toBeVisible();
    await expect(this.password2Input).toHaveAttribute('placeholder', 'Password (again)');
    await expect(this.password2Input).toHaveAttribute('type', 'password');
    await expect(this.password2Input).toHaveAttribute('required');
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.emailInput.clear();
    await this.password1Input.clear();
    await this.password2Input.clear();
  }

  /**
   * Verify form fields are empty
   */
  async expectFormEmpty() {
    await expect(this.emailInput).toHaveValue('');
    await expect(this.password1Input).toHaveValue('');
    await expect(this.password2Input).toHaveValue('');
  }

  /**
   * Check if passwords match
   */
  async expectPasswordsMatch(password1: string, password2: string) {
    await expect(this.password1Input).toHaveValue(password1);
    await expect(this.password2Input).toHaveValue(password2);
  }
}
