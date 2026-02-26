import { test, expect } from "../fixtures/test.fixture";

test("should successfully sign up and sign in with new user", async ({
  signupPage,
  loginPage,
  homePage,
  settingsPage,
}) => {
  const username: string = `AT_user_${new Date().getTime()}`;
  const email: string = `${username}@example.com`;
  const password: string = `AT_${process.env.PASSWORD || "password123"}_${new Date().getTime()}`; // fallback to use default password if not sent in .env

  await test.step("sign up with new user credentials", async () => {
    await signupPage.goto();
    await signupPage.register(username, email, password);
    await expect(signupPage.successMessage).toBeVisible();
    await expect(loginPage.signInHeading).toBeVisible();
  });

  await test.step("sign in with the newly registered user", async () => {
    await loginPage.login(email, password);
    await expect(homePage.myFeedTab).toBeVisible();
  });

  await test.step("check the user details are correct in the settings page", async () => {
    await settingsPage.goto();
    await expect(settingsPage.usernameInput).toHaveValue(username);
    await expect(settingsPage.emailInput).toHaveValue(email);
  });
});

test("should not be able to login with invalid credentials", async ({
  loginPage,
  newUser,
}) => {
  await test.step("login with invalid email", async () => {
    await loginPage.goto();
    await loginPage.login("invalidemail@example.com", newUser.password);
    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });

  await test.step("login with invalid password", async () => {
    await loginPage.page.reload(); // reload the page to clear previous error message
    await loginPage.login(newUser.email, "wrongpassword");
    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });
});

test("should successfully log out and redirect to home page", async ({
  loginPage,
  homePage,
  settingsPage,
  newUser,
}) => {
  await test.step("login with valid credentials", async () => {
    await loginPage.goto();
    await loginPage.login(newUser.email, newUser.password);
    await expect(homePage.myFeedTab).toBeVisible();
  });

  await test.step("log out from settings page", async () => {
    await settingsPage.goto();
    await settingsPage.logoutButton.click();
    await expect(homePage.myFeedTab).not.toBeVisible();
  });
});
