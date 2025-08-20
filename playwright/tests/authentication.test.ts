import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProfilePage } from '../pages/profile.page';
import { SignOutPage } from '../pages/signout.page';
import { INVALID_CREDENTIALS, VALID_USER } from '../test-data/auth';

test.describe('Authentication', () => {
  let loginPage: LoginPage;
  let profilePage: ProfilePage;
  let signOutPage: SignOutPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);
    signOutPage = new SignOutPage(page);
    homePage = new HomePage(page);
  });

  test.describe('Login', () => {
    test('should successfully log in and log out with valid credentials', async () => {
      // Navigate to login page
      await loginPage.goto();
      await loginPage.expectToBeOnLoginPage();
      
      // Enter valid credentials
      await loginPage.fillLoginForm(VALID_USER.email, VALID_USER.password);
      await loginPage.submit();
      
      // Verify profile page loads with success message
      await profilePage.expectToBeOnProfilePage();
      await profilePage.expectPageLoaded();
      await profilePage.expectSuccessMessage(VALID_USER.email);
      await profilePage.expectUserName(VALID_USER.username);
      
      // Verify user name exists
      const displayedUserName = await profilePage.getUserName();
      expect(displayedUserName).toBe(VALID_USER.username);
      
      // Go to home page and verify authenticated user message
      await homePage.goto();
      await homePage.expectToBeOnHomePage();
      await homePage.expectAuthenticatedUser(VALID_USER.email);

      // Click sign out nav button
      await homePage.clickSignOut();
      
      // Verify sign out page loads
      await signOutPage.expectToBeOnSignOutPage();
      await signOutPage.expectPageLoaded();
      
      // Click sign out button
      await signOutPage.clickSignOut();
      
      // Verify "You have signed out" message appears on home page
      await homePage.expectToBeOnHomePage();
      await homePage.expectSuccessMessage('You have signed out.');
    });

    test('should show error message for invalid credentials', async () => {
      // Navigate to login page
      await loginPage.goto();
      await loginPage.expectToBeOnLoginPage();
      
      // Enter invalid credentials
      await loginPage.fillLoginForm(INVALID_CREDENTIALS[0].email, INVALID_CREDENTIALS[0].password);
      await loginPage.submit();
      
      // Verify error message appears
      await loginPage.expectErrorMessage('The email address and/or password you specified are not correct.');
    });

    test('should show error message for valid email but wrong password', async () => {
      // Navigate to login page
      await loginPage.goto();
      await loginPage.expectToBeOnLoginPage();
      
      // Enter valid email but wrong password
      await loginPage.fillLoginForm(INVALID_CREDENTIALS[1].email, INVALID_CREDENTIALS[1].password);
      await loginPage.submit();
      
      // Verify error message appears
      await loginPage.expectErrorMessage('The email address and/or password you specified are not correct.');
    });
  });

  test.describe('Account Data Persistence', () => {

    test('should persist user points across login/logout cycles', async () => {
      // First, log in
      await loginPage.goto();
      await loginPage.fillLoginForm(VALID_USER.email, VALID_USER.password);
      await loginPage.submit();
      
      // Verify we're on profile page
      await profilePage.expectToBeOnProfilePage();
      
      // Go to home page
      await homePage.goto();
      await homePage.expectToBeOnHomePage();
      
      // Get initial points
      const initialPoints = await homePage.getPointsRemaining();
      
      // Add some points
      await homePage.clickAddFivePoints();
      await homePage.waitForPointsUpdate();
      await homePage.clickAddFivePoints();
      await homePage.waitForPointsUpdate();
      
      // Get points after adding
      const pointsAfterAdding = await homePage.getPointsRemaining();
      expect(parseFloat(pointsAfterAdding)).toBeGreaterThan(parseFloat(initialPoints));
      
      // Sign out
      await homePage.clickSignOut();
      await signOutPage.expectToBeOnSignOutPage();
      await signOutPage.clickSignOut();
      await homePage.expectSuccessMessage('You have signed out.');
      
      // Sign back in
      await loginPage.goto();
      await loginPage.fillLoginForm(VALID_USER.email, VALID_USER.password);
      await loginPage.submit();
      await profilePage.expectToBeOnProfilePage();
      
      // Go back to home page
      await homePage.goto();
      await homePage.expectToBeOnHomePage();
      
      // Verify points are the same as before sign out
      const pointsAfterReLogin = await homePage.getPointsRemaining();
      expect(parseFloat(pointsAfterReLogin)).toBe(parseFloat(pointsAfterAdding));
    });
  });
});
