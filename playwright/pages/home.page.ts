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
  
  // Specific reward cards (by data attributes)
  readonly toteBagCard: Locator;
  readonly coffeePotionCard: Locator;
  readonly presentationWandCard: Locator;
  readonly mimicMousePadCard: Locator;
  readonly wifiScrollCard: Locator;
  readonly tshirtCard: Locator;
  
  // Reward card states
  readonly redeemButtons: Locator;
  readonly unredeemButtons: Locator;
  
  // Footer
  readonly disclaimer: Locator;

  constructor(page: Page) {
    super(page);
    
    // Points and rewards section
    this.pointsStatusSection = page.locator('#points-status');
    this.pointsAvailable = page.locator('[data-points-available]');
    this.pointsRedeemed = page.locator('.card-header:has-text("Ponts Redeemed") + .card-body');
    this.pointsRemaining = page.locator('.card-header:has-text("Ponts Remaining") + .card-body');
    this.claimRewardsButton = page.getByRole('button', { name: 'Claim my rewards' });
    
    // Points section
    this.needMorePointsAlert = page.getByRole('alert');
    this.addFivePointsLink = page.getByRole('link', { name: '+5' });
    this.addFifteenPointsLink = page.getByRole('link', { name: '+15' });
    this.forfeitPointsLink = page.getByRole('link', { name: 'forfeit all points' });
    
    // Reward cards
    this.rewardCards = page.locator('.card.text-white.bg-primary');
    
    // Specific reward cards (by data attributes)
    this.toteBagCard = page.locator('[data-reward-id="1"]');
    this.coffeePotionCard = page.locator('[data-reward-id="2"]');
    this.presentationWandCard = page.locator('[data-reward-id="3"]');
    this.mimicMousePadCard = page.locator('[data-reward-id="4"]');
    this.wifiScrollCard = page.locator('[data-reward-id="5"]');
    this.tshirtCard = page.locator('[data-reward-id="6"]');
    
    // Reward card states
    this.redeemButtons = page.getByRole('button', { name: 'Redeem this Reward' });
    this.unredeemButtons = page.getByRole('button', { name: 'Un-redeem' });
    
    // Footer
    this.disclaimer = page.locator('[data-django-slot="disclaimer"]');
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto('/');
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
    await expect(this.rewardCards.count()).toBeGreaterThan(0); // There should be at least one reward card
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
  }

  /**
   * Click the +15 bonus points link
   */
  async clickAddFifteenPoints() {
    await this.addFifteenPointsLink.click();
  }

  /**
   * Click the forfeit all points link
   */
  async clickForfeitPoints() {
    await this.forfeitPointsLink.click();
  }

  /**
   * Get reward card by index
   */
  getRewardCard(index: number): Locator {
    return this.rewardCards.nth(index);
  }

  /**
   * Get reward card title by index
   */
  async getRewardCardTitle(index: number): Promise<string> {
    const card = this.getRewardCard(index);
    const title = card.locator('.card-header .h4');
    const text = await title.textContent();
    if (!text) {
      throw new Error(`Reward card title not found for index ${index}`);
    }
    return text;
  }

  /**
   * Get reward card points by index
   */
  async getRewardCardPoints(index: number): Promise<string> {
    const card = this.getRewardCard(index);
    const points = card.locator('.card-header .h5');
    const text = await points.textContent();
    if (!text) {
      throw new Error(`Reward card points not found for index ${index}`);
    }
    return text;
  }

  /**
   * Get reward card description by index
   */
  async getRewardCardDescription(index: number): Promise<string> {
    const card = this.getRewardCard(index);
    const description = card.locator('.card-body p');
    const text = await description.textContent();
    if (!text) {
      throw new Error(`Reward card description not found for index ${index}`);
    }
    return text;
  }

  /**
   * Click redeem button for a specific reward card
   */
  async clickRedeemReward(index: number) {
    const card = this.getRewardCard(index);
    const redeemButton = card.getByRole('button', { name: 'Redeem this Reward' });
    await redeemButton.click();
  }

  /**
   * Click unredeem button for a specific reward card
   */
  async clickUnredeemReward(index: number) {
    const card = this.getRewardCard(index);
    const unredeemButton = card.getByRole('button', { name: 'Un-redeem' });
    await unredeemButton.click();
  }

  /**
   * Click redeem button for a specific reward by ID
   */
  async clickRedeemRewardById(rewardId: string) {
    const rewardCard = this.page.locator(`[data-reward-id="${rewardId}"]`);
    const redeemButton = rewardCard.getByRole('button', { name: 'Redeem this Reward' });
    await redeemButton.click();
  }

  /**
   * Click unredeem button for a specific reward by ID
   */
  async clickUnredeemRewardById(rewardId: string) {
    const rewardCard = this.page.locator(`[data-reward-id="${rewardId}"]`);
    const unredeemButton = rewardCard.getByRole('button', { name: 'Un-redeem' });
    await unredeemButton.click();
  }

  /**
   * Verify specific reward cards exist
   */
  async expectRewardCards() {
    await expect(this.toteBagCard).toBeVisible();
    await expect(this.coffeePotionCard).toBeVisible();
    await expect(this.presentationWandCard).toBeVisible();
    await expect(this.mimicMousePadCard).toBeVisible();
    await expect(this.wifiScrollCard).toBeVisible();
    await expect(this.tshirtCard).toBeVisible();
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
    await expect(this.page.getByText('Ponts Redeemed')).toBeVisible();
    await expect(this.page.getByText('Ponts Remaining')).toBeVisible();
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
    await this.page.waitForTimeout(1000); // Wait for any AJAX updates
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
   * Check if a reward card is redeemed
   */
  async isRewardRedeemed(index: number): Promise<boolean> {
    const card = this.getRewardCard(index);
    const unredeemButton = card.getByRole('button', { name: 'Un-redeem' });
    return await unredeemButton.isVisible();
  }

  /**
   * Check if a reward card is available for redemption
   */
  async isRewardAvailable(index: number): Promise<boolean> {
    const card = this.getRewardCard(index);
    const redeemButton = card.getByRole('button', { name: 'Redeem this Reward' });
    return await redeemButton.isVisible();
  }

  /**
   * Get reward card button text
   */
  async getRewardButtonText(index: number): Promise<string> {
    const card = this.getRewardCard(index);
    const button = card.getByRole('button');
    const text = await button.textContent();
    if (!text) {
      throw new Error(`Reward card button text not found for index ${index}`);
    }
    return text;
  }

  /**
   * Get complete reward card data including state
   */
  async getRewardCardData(index: number): Promise<RewardCard> {
    const card = this.getRewardCard(index);
    const id = await card.getAttribute('data-reward-id') || index.toString();
    const title = await this.getRewardCardTitle(index);
    const points = await this.getRewardCardPoints(index);
    const description = await this.getRewardCardDescription(index);
    const isRedeemed = await this.isRewardRedeemed(index);
    
    return {
      id,
      title,
      points,
      description,
      isRedeemed
    };
  }

  /**
   * Get all reward card data with state
   */
  async getAllRewardData(): Promise<RewardCard[]> {
    const rewards: RewardCard[] = [];
    for (let i = 0; i < 6; i++) {
      const rewardData = await this.getRewardCardData(i);
      rewards.push(rewardData);
    }
    return rewards;
  }

  /**
   * Verify reward card data matches expected values
   */
  async expectRewardCardData(index: number, expectedData: Partial<RewardCard>) {
    const actualData = await this.getRewardCardData(index);
    
    if (expectedData.title !== undefined) {
      expect(actualData.title).toBe(expectedData.title);
    }
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
   * Verify reward card is in redeemed state
   */
  async expectRewardRedeemed(index: number) {
    await expect(this.getRewardCard(index).getByRole('button', { name: 'Un-redeem' })).toBeVisible();
    await expect(this.getRewardCard(index).getByRole('button', { name: 'Redeem this Reward' })).not.toBeVisible();
  }

  /**
   * Verify reward card is in available state
   */
  async expectRewardAvailable(index: number) {
    await expect(this.getRewardCard(index).getByRole('button', { name: 'Redeem this Reward' })).toBeVisible();
    await expect(this.getRewardCard(index).getByRole('button', { name: 'Un-redeem' })).not.toBeVisible();
  }


}
