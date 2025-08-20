import { Locator, Page, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  
  // Common navigation elements
  readonly navbarBrand: Locator;
  readonly homeLink: Locator;
  readonly aboutLink: Locator;
  readonly signUpNavLink: Locator;
  readonly signInNavLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Common navigation elements
    this.navbarBrand = page.getByRole('link', { name: 'holistiplan' });
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.aboutLink = page.getByRole('link', { name: 'About' });
    this.signUpNavLink = page.locator('#sign-up-link');
    this.signInNavLink = page.locator('#log-in-link');
  }

  /**
   * Navigate to home page
   */
  async clickHome() {
    await this.navbarBrand.click();
  }

  /**
   * Navigate to about page
   */
  async clickAbout() {
    await this.aboutLink.click();
  }

  /**
   * Navigate to sign up page
   */
  async clickSignUp() {
    await this.signUpNavLink.click();
  }

  /**
   * Navigate to sign in page
   */
  async clickSignIn() {
    await this.signInNavLink.click();
  }

  /**
   * Verify navigation elements are visible
   */
  async expectNavigationVisible() {
    await expect(this.navbarBrand).toBeVisible();
    await expect(this.homeLink).toBeVisible();
    await expect(this.aboutLink).toBeVisible();
    await expect(this.signUpNavLink).toBeVisible();
    await expect(this.signInNavLink).toBeVisible();
  }

  /**
   * Check if user is on home page
   */
  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL('/');
  }

  /**
   * Check if user is on about page
   */
  async expectToBeOnAboutPage() {
    await expect(this.page).toHaveURL('/about');
  }

  /**
   * Check if user is on signup page
   */
  async expectToBeOnSignupPage() {
    await expect(this.page).toHaveURL('/accounts/signup/');
  }

  /**
   * Check if user is on login page
   */
  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL('/accounts/login/');
  }
}
