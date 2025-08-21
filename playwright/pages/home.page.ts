import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

interface RewardCard {
  id: string;
  title: string;
  points: string;
  description: string;
  isRedeemed: boolean;
}

export class HomePage extends BasePage {
  
  // Points and rewards section
  readonly pointsStatusSection: Locator;
  readonly pointsAvailable: Locator;
  readonly pointsRedeemed: Locator;
  readonly pointsRemaining: Locator;
  readonly claimRewardsButton: Locator;
  
  // Points section
  readonly needMorePointsAlert: Locator;
  readonly addFivePointsLink: Locator;
  readonly addFifteenPointsLink: Locator;
  readonly forfeitPointsLink: Locator;
  
  // Reward cards
  readonly rewardCards: Locator;
  
  // Footer
  readonly disclaimer: Locator;

  constructor(page: Page) {
    super(page);
    
    // Points and rewards section
    this.pointsStatusSection = page.locator('#points-status');
    this.pointsAvailable = page.locator('[data-points-available]');
    this.pointsRedeemed = page.locator('.card-header:has-text("Points Redeemed") + .card-body');
    this.pointsRemaining = page.locator('.card-header:has-text("Points Remaining") + .card-body');
    this.claimRewardsButton = page.getByRole('button', { name: 'Claim my rewards' });
    
    // Points section
    this.needMorePointsAlert = page.getByRole('alert');
    this.addFivePointsLink = page.getByRole('link', { name: '+5' });
    this.addFifteenPointsLink = page.getByRole('link', { name: '+15' });
    this.forfeitPointsLink = page.getByRole('link', { name: 'forfeit all points' });
    
    // Reward cards
    this.rewardCards = page.locator('.card.text-white.bg-primary');
    
    // Footer
    this.disclaimer = page.locator('[data-django-slot="disclaimer"]');
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto('/');
    // Wait for Vue components to load
    await this.page.waitForSelector('.reward-claim a', { timeout: 10000 });
  }

  /**
   * Check if user is on the home page
   */
  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL('/');
    await expect(this.pointsStatusSection).toBeVisible();
  }

  /**
   * Verify the page is loaded correctly
   */
  async expectPageLoaded() {
    await expect(this.pointsStatusSection).toBeVisible();
    const count = await this.rewardCards.count();
    await expect(count).toBeGreaterThan(0); // There should be at least one reward card
    await expect(this.needMorePointsAlert).toBeVisible();
  }

  /**
   * Get the number of points available
   */
  async getPointsAvailable(): Promise<string> {
    const pointsAttr = await this.pointsStatusSection.getAttribute('data-points-available');
    if (!pointsAttr) {
      throw new Error('Points available attribute not found on points status section');
    }
    return pointsAttr;
  }

  /**
   * Get the number of points redeemed
   */
  async getPointsRedeemed(): Promise<string> {
    const text = await this.pointsRedeemed.textContent();
    if (!text) {
      throw new Error('Points redeemed element not found or empty');
    }
    return text;
  }

  /**
   * Get the number of points remaining
   */
  async getPointsRemaining(): Promise<string> {
    const text = await this.pointsRemaining.textContent();
    if (!text) {
      throw new Error('Points remaining element not found or empty');
    }
    return text;
  }

  /**
   * Check if claim rewards button is enabled
   */
  async expectClaimButtonEnabled() {
    await expect(this.claimRewardsButton).toBeEnabled();
  }

  /**
   * Check if claim rewards button is disabled
   */
  async expectClaimButtonDisabled() {
    await expect(this.claimRewardsButton).toBeDisabled();
  }

  /**
   * Click the claim rewards button
   */
  async clickClaimRewards() {
    await this.claimRewardsButton.click();
  }

  /**
   * Click the +5 bonus points link
   */
  async clickAddFivePoints() {
    await this.addFivePointsLink.click();
    await this.page.waitForTimeout(500); // Wait for AJAX request to complete
  }

  /**
   * Click the +15 bonus points link
   */
  async clickAddFifteenPoints() {
    await this.addFifteenPointsLink.click();
    await this.page.waitForTimeout(500); // Wait for AJAX request to complete
  }

  /**
   * Click the forfeit all points link
   */
  async clickForfeitPoints() {
    await this.forfeitPointsLink.click();
  }

  /**
   * Get reward card by title (recommended for order-independent tests)
   */
  getRewardCardByTitle(title: string): Locator {
    return this.rewardCards.filter({ hasText: title });
  }

  /**
   * Wait for reward card to be fully loaded by title
   */
  async waitForRewardCardByTitle(title: string) {
    const card = this.getRewardCardByTitle(title);
    await card.waitFor({ state: 'visible', timeout: 10000 });
    await card.locator('.reward-claim a').waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get reward card points by title
   */
  async getRewardCardPointsByTitle(title: string): Promise<string> {
    const card = this.getRewardCardByTitle(title);
    const points = card.locator('.card-header .h5');
    const text = await points.textContent();
    if (!text) {
      throw new Error(`Reward card points not found for title "${title}"`);
    }
    // Remove "pts" from the text, parse as number, and format consistently
    const numberText = text.replace('pts', '').trim();
    const number = parseFloat(numberText);
    return number.toString();
  }

  /**
   * Get reward card description by title
   */
  async getRewardCardDescriptionByTitle(title: string): Promise<string> {
    const card = this.getRewardCardByTitle(title);
    const description = card.locator('.card-body p');
    const text = await description.textContent();
    if (!text) {
      throw new Error(`Reward card description not found for title "${title}"`);
    }
    return text;
  }



  /**
   * Click redeem button for a specific reward card by title
   */
  async clickRedeemRewardByTitle(title: string) {
    await this.waitForRewardCardByTitle(title);
    const card = this.getRewardCardByTitle(title);
    const redeemButton = card.getByText('Redeem this Reward');
    await redeemButton.click();
  }

  /**
   * Click unredeem button for a specific reward card by title
   */
  async clickUnredeemRewardByTitle(title: string) {
    const card = this.getRewardCardByTitle(title);
    const unredeemButton = card.getByText('Un-redeem');
    await unredeemButton.click();
  }

  /**
   * Verify alert message content
   */
  async expectAlertContent() {
    await expect(this.needMorePointsAlert).toContainText('Need more points?');
    await expect(this.needMorePointsAlert).toContainText('Had Enough?');
    await expect(this.addFivePointsLink).toBeVisible();
    await expect(this.addFifteenPointsLink).toBeVisible();
    await expect(this.forfeitPointsLink).toContainText('forfeit all points');
  }

  /**
   * Verify points display
   */
  async expectPointsDisplay() {
    await expect(this.pointsRedeemed).toBeVisible();
    await expect(this.pointsRemaining).toBeVisible();
    await expect(this.page.getByText('Points Redeemed')).toBeVisible();
    await expect(this.page.getByText('Points Remaining')).toBeVisible();
  }

  /**
   * Verify footer content
   */
  async expectFooterContent() {
    await expect(this.disclaimer).toContainText('This app is for demonstration purposes only');
    await expect(this.disclaimer).toContainText('Rewards are entirely fictitious');
  }

  /**
   * Wait for points to update
   */
  async waitForPointsUpdate() {
    // Wait for any AJAX updates and UI changes
    await this.page.waitForTimeout(1500); // Increased wait time for reliability
  }

  /**
   * Check if user is anonymous
   */
  async expectAnonymousUser() {
    await expect(this.disclaimer).toContainText('AnonymousUser');
  }

  /**
   * Check if user is authenticated
   */
  async expectAuthenticatedUser(username: string) {
    await expect(this.disclaimer).not.toContainText('AnonymousUser');
    await expect(this.disclaimer).toContainText(username);
  }

  /**
   * Check if a reward card is redeemed by title
   */
  async isRewardRedeemedByTitle(title: string): Promise<boolean> {
    const card = this.getRewardCardByTitle(title);
    const unredeemButton = card.getByText('Un-redeem');
    return await unredeemButton.isVisible();
  }

  /**
   * Get complete reward card data including state by title
   */
  async getRewardCardDataByTitle(title: string): Promise<RewardCard> {
    const card = this.getRewardCardByTitle(title);
    const id = await card.getAttribute('data-reward-id') || title;
    const points = await this.getRewardCardPointsByTitle(title);
    const description = await this.getRewardCardDescriptionByTitle(title);
    const isRedeemed = await this.isRewardRedeemedByTitle(title);
    
    return {
      id,
      title,
      points,
      description,
      isRedeemed
    };
  }

  /**
   * Verify reward card data matches expected values by title
   */
  async expectRewardCardDataByTitle(title: string, expectedData: Partial<RewardCard>) {
    const actualData = await this.getRewardCardDataByTitle(title);
    
    if (expectedData.points !== undefined) {
      expect(actualData.points).toBe(expectedData.points);
    }
    if (expectedData.description !== undefined) {
      expect(actualData.description).toBe(expectedData.description);
    }
    if (expectedData.isRedeemed !== undefined) {
      expect(actualData.isRedeemed).toBe(expectedData.isRedeemed);
    }
  }

  /**
   * Verify reward card is in redeemed state by title
   */
  async expectRewardRedeemedByTitle(title: string) {
    await expect(this.getRewardCardByTitle(title).getByText('Un-redeem')).toBeVisible();
    await expect(this.getRewardCardByTitle(title).getByText('Redeem this Reward')).not.toBeVisible();
  }

  /**
   * Verify success message is displayed
   */
  async expectSuccessMessage(expectedMessage: string) {
    const successAlert = this.page.locator('.alert.alert-dismissible').filter({ hasText: expectedMessage });
    await expect(successAlert).toBeVisible();
  }

  /**
   * Verify all expected rewards are present on the page
   */
  async expectAllRewardsPresent(expectedTitles: string[]) {
    for (const title of expectedTitles) {
      await expect(this.getRewardCardByTitle(title)).toBeVisible();
    }
  }

}
