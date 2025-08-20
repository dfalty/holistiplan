import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  // Profile specific elements
  readonly successMessage: Locator;
  readonly userName: Locator;
  readonly myInfoButton: Locator;
  readonly emailButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Profile specific elements
    this.successMessage = page.locator('.alert.alert-dismissible.alert-success');
    this.userName = page.locator('h2');
    this.myInfoButton = page.getByRole('button', { name: 'My Info' });
    this.emailButton = page.getByRole('button', { name: 'E-Mail' });
  }

  /**
   * Navigate to the profile page
   */
  async goto() {
    await this.page.goto('/users/1/');
  }

  /**
   * Check if user is on the profile page
   */
  async expectToBeOnProfilePage() {
    await expect(this.page).toHaveURL('/users/1/');
    await expect(this.userName).toBeVisible();
  }

  /**
   * Verify the page is loaded correctly
   */
  async expectPageLoaded() {
    await expect(this.userName).toBeVisible();
    await expect(this.myInfoButton).toBeVisible();
    await expect(this.emailButton).toBeVisible();
  }

  /**
   * Verify success message is displayed
   */
  async expectSuccessMessage(email: string) {
    const expectedMessage = `Successfully signed in as ${email}.`;
    await expect(this.successMessage).toContainText(expectedMessage);
  }

  /**
   * Verify user name is displayed
   */
  async expectUserName(username: string) {
    await expect(this.userName).toHaveText(username);
  }

  /**
   * Get the displayed user name
   */
  async getUserName(): Promise<string> {
    const text = await this.userName.textContent();
    if (!text) {
      throw new Error('User name not found');
    }
    return text;
  }

  /**
   * Click My Info button
   */
  async clickMyInfo() {
    await this.myInfoButton.click();
  }

  /**
   * Click E-Mail button
   */
  async clickEmail() {
    await this.emailButton.click();
  }
}

