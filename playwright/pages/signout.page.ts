import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SignOutPage extends BasePage {
  // Sign out specific elements
  readonly pageTitle: Locator;
  readonly confirmationMessage: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Sign out specific elements
    this.pageTitle = page.getByRole('heading', { name: 'Sign Out' });
    this.confirmationMessage = page.getByText('Are you sure you want to sign out?');
    this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
  }

  /**
   * Navigate to the sign out page
   */
  async goto() {
    await this.page.goto('/accounts/logout/');
  }

  /**
   * Check if user is on the sign out page
   */
  async expectToBeOnSignOutPage() {
    await expect(this.page).toHaveURL('/accounts/logout/');
    await expect(this.pageTitle).toBeVisible();
  }

  /**
   * Verify the page is loaded correctly
   */
  async expectPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.confirmationMessage).toBeVisible();
    await expect(this.signOutButton).toBeVisible();
  }

  /**
   * Click the sign out button
   */
  async clickSignOut() {
    await this.signOutButton.click();
  }
}

