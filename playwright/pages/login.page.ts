import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly pageTitle: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form elements
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.rememberMeCheckbox = page.getByLabel('Remember Me');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    this.signUpLink = page.getByRole('link', { name: 'sign up' });
    
    // Page content
    this.pageTitle = page.getByRole('heading', { name: 'Sign In' });
    this.errorMessage = page.getByRole('alert');
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/accounts/login/');
  }

  /**
   * Fill in the login form
   */
  async fillLoginForm(email: string, password: string, rememberMe: boolean = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    } else {
      await this.rememberMeCheckbox.uncheck();
    }
  }

  /**
   * Submit the login form
   */
  async submit() {
    await this.signInButton.click();
  }

  /**
   * Complete login process
   */
  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.fillLoginForm(email, password, rememberMe);
    await this.submit();
  }

  /**
   * Click the forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }



  /**
   * Verify the page is loaded correctly
   */
  async expectPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  /**
   * Check if user is on the login page
   */
  async expectToBeOnLoginPage() {
    await super.expectToBeOnLoginPage();
    await expect(this.pageTitle).toHaveText('Sign In');
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
}
