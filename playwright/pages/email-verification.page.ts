import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class EmailVerificationPage extends BasePage {
  readonly pageTitle: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Page content
    this.pageTitle = page.getByRole('heading', { name: 'Verify Your E-mail Address' });
    this.confirmationMessage = page.locator('p');
  }

  /**
   * Navigate to the email verification page
   */
  async goto() {
    await this.page.goto('/accounts/confirm-email/');
  }

  /**
   * Verify the page is loaded correctly
   */
  async expectPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.confirmationMessage).toBeVisible();
  }

  /**
   * Check if user is on the email verification page
   */
  async expectToBeOnEmailVerificationPage() {
    await expect(this.page).toHaveURL('/accounts/confirm-email/');
    await expect(this.pageTitle).toHaveText('Verify Your E-mail Address');
  }

  /**
   * Verify the confirmation message text
   */
  async expectConfirmationMessage() {
    await expect(this.confirmationMessage).toContainText(
      'We have sent an e-mail to you for verification. Follow the link provided to finalize the signup process. Please contact us if you do not receive it within a few minutes.'
    );
  }
}
