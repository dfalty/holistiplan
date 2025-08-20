import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import {
    REWARD_DATA,
    getTotalRewardCost
} from '../test-data/rewards';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.hideDebugToolbar();
  });

  test.describe('Page Load and Structure', () => {
    test('should load home page correctly', async () => {
      await homePage.expectToBeOnHomePage();
      await homePage.expectPageLoaded();
    });

    test('should display navigation elements', async () => {
      await homePage.expectNavigationVisible();
    });

    test('should display points section', async () => {
      await homePage.expectPointsDisplay();
    });

    test('should display alert with bonus points options', async () => {
      await homePage.expectAlertContent();
    });

    test('should display footer content', async () => {
      await homePage.expectFooterContent();
    });

    test('should show user as anonymous initially', async () => {
      await homePage.expectAnonymousUser();
    });
  });

  test.describe('Points System', () => {
    test('should display points information', async () => {
      const pointsAvailable = await homePage.getPointsAvailable();
      const pointsRedeemed = await homePage.getPointsRedeemed();
      const pointsRemaining = await homePage.getPointsRemaining();

      expect(pointsAvailable).toBeTruthy();
      expect(pointsRedeemed).toBeTruthy();
      expect(pointsRemaining).toBeTruthy();
      expect(parseFloat(pointsAvailable)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(pointsRedeemed)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(pointsRemaining)).toBeGreaterThanOrEqual(0);
    });

    test('should allow adding bonus points', async () => {
      const initialPoints = await homePage.getPointsRemaining();
      
      // Add 5 points
      await homePage.clickAddFivePoints();
      await homePage.waitForPointsUpdate();
      
      // Wait for points to update and verify
      const afterFivePoints = await homePage.getPointsRemaining();
      expect(parseFloat(afterFivePoints)).toBe(parseFloat(initialPoints) + 5);
      
      // Add 15 more points
      await homePage.clickAddFifteenPoints();
      await homePage.waitForPointsUpdate();
      
      // Wait for points to update and verify
      const afterFifteenPoints = await homePage.getPointsRemaining();
      expect(parseFloat(afterFifteenPoints)).toBe(parseFloat(initialPoints) + 20);
    });

    test('should allow forfeiting all points', async () => {
      await homePage.clickForfeitPoints();
      await homePage.waitForPointsUpdate();
      
      const pointsAfterForfeit = await homePage.getPointsRemaining();
      expect(parseFloat(pointsAfterForfeit)).toBe(0);
    });
  });
  
  test.describe('Individual Reward Card Redemption', () => {

    // Generate individual tests for each reward
    for (const reward of REWARD_DATA) {
      test(`redeem & claim: ${reward.title}`, async () => {
        // Add enough points for this reward
        for (let i = 0; i < reward.requiredPoints; i++) {
          await homePage.clickAddFivePoints();
          await homePage.waitForPointsUpdate();
        }
        
        const initialPointsRemaining = await homePage.getPointsRemaining();
        const initialPointsRedeemed = await homePage.getPointsRedeemed();
        
        // Validate reward exists and data is correct
        await homePage.expectRewardCardData(reward.index, {
          title: reward.title,
          points: reward.points.toString(),
          description: reward.description,
          isRedeemed: false
        });
        
        // Redeem the reward
        await homePage.clickRedeemReward(reward.index);
        await homePage.waitForPointsUpdate();
        
        // Verify reward is now redeemed
        await homePage.expectRewardRedeemed(reward.index);
        
        // Verify points redeemed has increased (including the +2 bug)
        const newPointsRedeemed = await homePage.getPointsRedeemed();
        expect(parseFloat(newPointsRedeemed)).toBe(parseFloat(initialPointsRedeemed) + reward.points + 2); // +2 points is the bug
        
        // Verify points remaining has decreased (including the +2 bug)
        const newPointsRemaining = await homePage.getPointsRemaining();
        expect(parseFloat(newPointsRemaining)).toBe(parseFloat(initialPointsRemaining) - reward.points - 2); // +2 points is the bug
        
        // Claim the reward
        await homePage.clickClaimRewards();
        await homePage.waitForPointsUpdate();
        
        // Verify success message
        await homePage.expectSuccessMessage(`You successfully claimed the following rewards: ${reward.title}`);
      });
    }

  });

  test.describe('Reward Redemption and Unredemption', () => {
    test('should allow redeeming and unredeeming a reward', async () => {
      const initialPoints = await homePage.getPointsRemaining();
      const rewardPoints = await homePage.getRewardCardPoints(0);
      
      // Start with available state
      await homePage.expectRewardAvailable(0);
      
      // Redeem the reward
      await homePage.clickRedeemReward(0);
      await homePage.waitForPointsUpdate();
      await homePage.expectRewardRedeemed(0);
      
      // Verify points are deducted
      const pointsAfterRedemption = await homePage.getPointsRemaining();
      expect(parseFloat(pointsAfterRedemption)).toBe(parseFloat(initialPoints) - parseFloat(rewardPoints) - 2); // 2 points is the bug
      
      // Unredeem the reward
      await homePage.clickUnredeemReward(0);
      await homePage.waitForPointsUpdate();
      await homePage.expectRewardAvailable(0);
      
      // Verify points are restored
      const finalPoints = await homePage.getPointsRemaining();
      expect(parseFloat(finalPoints)).toBe(parseFloat(initialPoints));
    });
  });

  test.describe('Multiple Reward Interactions', () => {
    test('should complete full redemption process for all rewards', async () => {
      // Add enough points to redeem all rewards (total cost: 14.25 points)
      await homePage.clickAddFifteenPoints();
      await homePage.clickAddFifteenPoints();
      await homePage.clickAddFifteenPoints();
      await homePage.waitForPointsUpdate();
      
      const initialPointsRemaining = await homePage.getPointsRemaining();
      const initialPointsRedeemed = await homePage.getPointsRedeemed();
      
      // Validate all rewards exist and are available
      for (let i = 0; i < REWARD_DATA.length; i++) {
        await homePage.expectRewardAvailable(i);
        await homePage.expectRewardCardData(i, {
          title: REWARD_DATA[i].title,
          points: REWARD_DATA[i].points.toString(),
          isRedeemed: false
        });
      }
      
      // Redeem all rewards
      for (let i = 0; i < REWARD_DATA.length; i++) {
        await homePage.clickRedeemReward(i);
        await homePage.waitForPointsUpdate();
        await homePage.expectRewardRedeemed(i);
      }
      
      // Verify points redeemed has increased by total cost
      const newPointsRedeemed = await homePage.getPointsRedeemed();
      const totalCost = getTotalRewardCost() + (REWARD_DATA.length * 2); // 2 points per reward is the bug
      expect(parseFloat(newPointsRedeemed)).toBe(parseFloat(initialPointsRedeemed) + totalCost);
      
      // Verify points remaining has decreased by total cost
      const newPointsRemaining = await homePage.getPointsRemaining();
      expect(parseFloat(newPointsRemaining)).toBe(parseFloat(initialPointsRemaining) - totalCost);
      
      // Claim all rewards
      await homePage.clickClaimRewards();
      await homePage.waitForPointsUpdate();
      
      // Verify success message with all rewards listed
      const expectedMessage = `You successfully claimed the following rewards: ${REWARD_DATA.map(r => r.title).join(', ')}`;
      await homePage.expectSuccessMessage(expectedMessage);
    });
  });



  test.describe('Edge Cases', () => {
    test('should handle insufficient points for redemption', async () => {
      // Forfeit all points first
      await homePage.clickForfeitPoints();
      await homePage.waitForPointsUpdate();
      
      // Try to redeem a reward
      await homePage.clickRedeemReward(0);
      await homePage.waitForPointsUpdate();
      
      // Verify the reward button shows as un-redeem
      await homePage.expectRewardRedeemed(0);
      
      // Verify the "Claim my rewards" button remains disabled
      await homePage.expectClaimButtonDisabled();
    });

    test('should maintain state after page refresh', async ({ page }) => {
      // Get initial points state
      const initialPointsRedeemed = await homePage.getPointsRedeemed();
      const initialPointsRemaining = await homePage.getPointsRemaining();
      
      // Redeem a reward
      await homePage.clickRedeemReward(0);
      await homePage.waitForPointsUpdate();
      
      // Get points state after redemption
      const pointsRedeemedAfterRedemption = await homePage.getPointsRedeemed();
      const pointsRemainingAfterRedemption = await homePage.getPointsRemaining();
      
      // Refresh the page
      await page.reload();
      await homePage.expectToBeOnHomePage();
      
      // Verify the reward is still redeemed
      await homePage.expectRewardRedeemed(0);
      
      // Verify points redeemed maintains state
      const pointsRedeemedAfterRefresh = await homePage.getPointsRedeemed();
      expect(parseFloat(pointsRedeemedAfterRefresh)).toBe(parseFloat(pointsRedeemedAfterRedemption));
      
      // Verify points remaining maintains state
      const pointsRemainingAfterRefresh = await homePage.getPointsRemaining();
      expect(parseFloat(pointsRemainingAfterRefresh)).toBe(parseFloat(pointsRemainingAfterRedemption));
    });
  });
});

