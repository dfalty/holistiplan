import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('Navigation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.describe('Navigation from Home Page', () => {
    test('should navigate to about page', async () => {
      await homePage.clickAbout();
      await homePage.expectToBeOnAboutPage();
    });

    test('should navigate to sign up page', async () => {
      await homePage.clickSignUp();
      await homePage.expectToBeOnSignupPage();
    });

    test('should navigate to sign in page', async () => {
      await homePage.clickSignIn();
      await homePage.expectToBeOnLoginPage();
    });

    test('should navigate to home page via brand', async () => {
      await homePage.clickHome();
      await homePage.expectToBeOnHomePage();
    });
  });
});

