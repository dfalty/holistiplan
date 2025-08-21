# Bug Report - HolistiPlan Test Application

## Overview

This document contains the findings from exploratory testing of the HolistiPlan test application.
Note: Each bug includes a status section to track progress on fixes as I went ahead and fixed the ones affecting automated tests.

## Bugs Discovered

### 1. Spelling Error on Main Page

**Name**: "Ponts" instead of "Points" typo

**Summary**
The main page displays "Ponts Redeemed" and "Ponts Remaining" instead of the correct spelling "Points Redeemed" and "Points Remaining".

**Steps to Reproduce**

1. Navigate to the home page
2. Look at the points display section
3. Observe the misspelled "Ponts" instead of "Points"

**Severity Assessment**: Low severity as a spelling issue, but since it appears in a prominent functional area of the main page, it should be prioritized for quick resolution.

**Status**: Fixed

---

### 2. About Page 404 Error

**Name**: Incorrect About page URL routing

**Summary**
Clicking the "About" link in the navigation redirects to `about//test` instead of the correct `/about` path, resulting in a 404 error.

**Steps to Reproduce**

1. Navigate to any page on the application
2. Click the "About" link in the navigation bar
3. Observe the browser redirects to an incorrect URL with double slashes and "/test" suffix

**Severity Assessment**: Medium.
This prevents users from accessing the About page entirely, which could contain important information about the application.

**Status**: Fixed

---

### 3. Reward Points Display Error

**Name**: All reward point values are 2 points too high

**Summary**
The displayed point values for all rewards are consistently 2 points higher than their actual values. For example, a reward that should cost 2.75 points shows as 4.75 points.

**Steps to Reproduce**

1. Navigate to the home page
2. Look at the reward cards
3. Compare the displayed point values with the expected values from the test data
4. Notice all values are inflated by 2 points

**Severity Assessment**: High.
Users may think they need more points than actually required, or may be confused about the true cost of rewards. This could significantly impact the user experience and trust in the system. Plus, I don't want to waste my hard earned points on an accounting issue!

**Status**: Fixed

---

### 4. Duplicate "Forgot Password" Links

**Name**: Two "Forgot Password" links appear on sign-in page

**Summary**
The sign-in page displays two identical "Forgot Password" links instead of just one, creating confusion and poor UI design.

**Steps to Reproduce**

1. Navigate to the sign-in page (/accounts/login/)
2. Look at the form
3. Observe two "Forgot Password" links are present

**Severity Assessment**: Low.
This is a UI duplication issue that doesn't break functionality but creates a confusing user interface.

**Status**: Fixed

### 5. Application Unresponsiveness

**Name**: Platform becomes unresponsive frequently

**Summary**
The application frequently becomes unresponsive, with actions like page loads or button clicks taking up to 30 seconds to respond. This appears to be performance-related. Note: May be related to my specific environment.
Note: Root cause identified as Django debug toolbar's excessive file watching causing constant reloads. Disabling the debug toolbar significantly reduced the frequency of hanging, though intermittent issues still occur.

**Steps to Reproduce**

1. Use the application normally
2. Attempt to navigate between pages or click buttons
3. Experience delays of up to 30 seconds before any response
4. This behavior is intermittent but frequent

**Severity Assessment**: Critical.
This is a severe performance issue that makes the application nearly unusable. Users will likely abandon the application if they have to wait 30 seconds for basic interactions.

**Status**: Fixed (Parially)

---

### 6. Negative Points Display

**Name**: Negative numbers appear in points remaining after page refresh

**Summary**
After refreshing the page, the "Points Remaining" section sometimes displays negative numbers instead of the correct positive values.

**Steps to Reproduce**
Unable to find reproduction steps.

**Severity Assessment**: High.
This could be a serious data bug that could confuse users and suggest system instability or data loss. The fact that it's intermittent makes it harder to debug but no less important to fix. These types of state management issues can become a real headache. It probably has something to do with a sync problem between the frontend and the backend.

**Status**: Open
