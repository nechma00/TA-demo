import { test, expect } from "../fixtures/test.fixture";
import { LoginPage } from "../pages/login.page";
import { ArticlePage } from "../pages/article.page";
import { faker } from "@faker-js/faker";
import { BrowserContext, Page } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { EditorPage } from "../pages/editor.page";

test("should create new article", async ({
  loginPage,
  homePage,
  editorPage,
  articlePage,
  newUser,
}) => {
  const title = `AT - ${faker.lorem.sentence()} - ${faker.string.nanoid(5)}`;
  const description = `${faker.lorem.sentence()} - ${faker.string.nanoid(5)}`;
  const body = `${faker.lorem.paragraphs(3)} - ${faker.string.nanoid(5)}`;
  const tags = ["test", "playwright", "article"];

  await test.step("login with valid credentials", async () => {
    await loginPage.goto();
    await loginPage.login(newUser.email, newUser.password);
  });

  await test.step("create new article", async () => {
    await editorPage.navigateToArticleEditor();
    await editorPage.fillArticleForm({ title, description, body });
    for (const tag of tags) {
      await editorPage.addTag(tag);
    }
    await editorPage.publishArticle();
    await expect(editorPage.publishSuccessMessage).toBeVisible();
  });

  await test.step("verify the article exists in feed", async () => {
    await homePage.goto();
    await homePage.page.waitForLoadState("networkidle"); // Ensure the home page is fully loaded before checking for the article
    await expect(homePage.articlesFeed).toContainText(title);
    await expect(homePage.articlesFeed).toContainText(description);
  });

  await test.step("verify the article details are correct", async () => {
    await homePage.articlesFeed.getByRole("link", { name: title }).click();
    await expect(articlePage.loadingHeading).not.toBeVisible();
    await expect(articlePage.articleContainer).toContainText(title);
    await expect(articlePage.articleContainer).toContainText(body);
    for (const tag of tags) {
      await expect(articlePage.articleContainer).toContainText(tag);
    }
  });

  await test.step("verify article exists in user profile", async () => {
    await homePage.openMyProfile();
    await expect(homePage.articlesFeed).toContainText(title);
    await expect(homePage.articlesFeed).toContainText(description);
  });

  await test.step("cleanup: delete the created article", async () => {
    await homePage.openArticle(title);
    await articlePage.deleteArticleButton.click();
  });
});

test("should edit existing article", async ({
  loginPage,
  homePage,
  editorPage,
  articlePage,
  userWithRandomArticle,
}) => {
  const newTitle = `AT - ${faker.lorem.sentence(3)} - updated - ${faker.string.nanoid(5)}`;
  const newDescription = `${faker.lorem.sentence(5)} - updated - ${faker.string.nanoid(5)}`;
  const newBody = `${faker.lorem.paragraphs(2)} - updated - ${faker.string.nanoid(5)}`;

  await test.step("login with valid credentials", async () => {
    await loginPage.goto();
    await loginPage.login(
      userWithRandomArticle.user.email,
      userWithRandomArticle.user.password,
    );
    await articlePage.page.waitForLoadState("networkidle"); // Ensure the article page is fully loaded before navigating to editor
  });

  await test.step("open existing article in editor", async () => {
    await articlePage.navigateToArticle(userWithRandomArticle.article.slug);
    console.log(articlePage.page.url());
    await articlePage.editArticleButton.click();
    await expect(editorPage.articleEditorHeading).toBeVisible();
  });

  await test.step("edit article details and publish", async () => {
    await editorPage.fillArticleForm({
      title: newTitle,
      description: newDescription,
      body: newBody,
    });
    await editorPage.addTag("edited");
    await editorPage.publishArticle();
    await expect(editorPage.publishSuccessMessage).toBeVisible();
  });

  await test.step("verify the updated article details are correct", async () => {
    await homePage.goto();
    await homePage.page.waitForLoadState("networkidle"); // Ensure the home page is fully loaded before checking for the article
    const article = await homePage.getArticleInFeed(newTitle);
    await expect(article).toContainText(newTitle);
    await expect(article).toContainText(newDescription);
  });

  await test.step("verify the updated article details are correct in article page", async () => {
    await homePage.openArticle(newTitle);
    await expect(articlePage.loadingHeading).not.toBeVisible();
    await expect(articlePage.articleContainer).toContainText(newTitle);
    await expect(articlePage.articleContainer).toContainText(newBody);
    await expect(articlePage.articleContainer).toContainText("edited");
  });
});

test("should delete existing article", async ({
  loginPage,
  homePage,
  articlePage,
  userWithRandomArticle,
}) => {
  await test.step("login with valid credentials", async () => {
    await loginPage.goto();
    await loginPage.login(
      userWithRandomArticle.user.email,
      userWithRandomArticle.user.password,
    );
    await articlePage.page.waitForLoadState("networkidle"); // Ensure the article page is fully loaded before navigating to editor
  });

  await test.step("delete the article", async () => {
    await articlePage.navigateToArticle(userWithRandomArticle.article.slug);
    await articlePage.deleteArticleButton.click();
    await expect(homePage.loadingArticlesMessage).not.toBeVisible();
    // Verify the deleted article is not listed in home page feed
    await expect(homePage.articlesFeed).not.toContainText(
      userWithRandomArticle.article.title,
    );
  });

  await test.step("verify the article is deleted and not accessible", async () => {
    // Try to navigate to the deleted article page directly
    await articlePage.navigateToArticle(userWithRandomArticle.article.slug);
    await expect(articlePage.noArticleHeading).toBeVisible();

    // Verify the article is not listed in user's profile
    await homePage.openMyProfile();
    await expect(homePage.articlesFeed).not.toContainText(
      userWithRandomArticle.article.title,
    );
  });
});

test("should see articles from followed authors in My Feed", async ({
  browser,
  twoUsersSetup,
}) => {
  // user 1 context and page objects
  let user1Context: BrowserContext,
    user1Page: Page,
    user1LoginPage: LoginPage,
    user1HomePage: HomePage,
    user1ArticlePage: ArticlePage,
    // user 2 context and page objects
    user2Context: BrowserContext,
    user2Page: Page,
    user2LoginPage: LoginPage,
    user2EditorPage: EditorPage;
  await test.step("create context for user 1 and login", async () => {
    user1Context = await browser.newContext();
    user1Page = await user1Context.newPage();
    user1LoginPage = new LoginPage(user1Page);
    await user1LoginPage.goto();
    await user1LoginPage.login(
      twoUsersSetup.user1.email,
      twoUsersSetup.user1.password,
    );
    await user1Page.waitForLoadState("networkidle"); // Ensure the page is fully loaded before proceeding
  });

  await test.step("go to the article page and follow the author", async () => {
    user1ArticlePage = new ArticlePage(user1Page);
    await user1ArticlePage.navigateToArticle(twoUsersSetup.user2.article.slug);
    await user1ArticlePage.toggleFollowAuthor();
    await expect(user1ArticlePage.unfollowAuthorButton).toBeVisible();
  });

  await test.step("check the article appears in user 1 My Feed", async () => {
    user1HomePage = new HomePage(user1Page);
    await user1HomePage.homeNavLink.click(); // navigate to home page
    await expect(user1HomePage.loadingArticlesMessage).not.toBeVisible();
    await user1HomePage.switchToMyFeed();
    await expect(user1HomePage.articlesFeed).toContainText(
      twoUsersSetup.user2.article.title,
    );
  });

  await test.step("create context for user 2 and login", async () => {
    user2Context = await browser.newContext();
    user2Page = await user2Context.newPage();
    user2LoginPage = new LoginPage(user2Page);
    await user2LoginPage.goto();
    await user2LoginPage.login(
      twoUsersSetup.user2.email,
      twoUsersSetup.user2.password,
    );
  });

  await test.step("go to the editor page and create new article with user 2", async () => {
    const title = faker.lorem.sentence();
    const description = faker.lorem.sentence();
    const body = faker.lorem.paragraphs(3);
    const tag = "user2_article";
    user2EditorPage = new EditorPage(user2Page);
    await user2EditorPage.navigateToArticleEditor();
    await user2EditorPage.fillArticleForm({ title, description, body });
    await user2EditorPage.addTag(tag);
    await user2EditorPage.publishArticle();
    await expect(user2EditorPage.publishSuccessMessage).toBeVisible();
  });

  await test.step("verify the new article from user 2 appears in user 1 My Feed", async () => {
    await user1HomePage.page.reload();
    await user1HomePage.switchToMyFeed();
    await expect(user1HomePage.loadingArticlesMessage).not.toBeVisible();
    await expect(user1HomePage.articlesFeed).toContainText(
      twoUsersSetup.user2.article.title,
    );
  });

  await test.step("cleanup: delete the 2nd article", async () => {
    const user2ArticlePage = new ArticlePage(user2Page);
    await user2ArticlePage.navigateToArticle(twoUsersSetup.user2.article.slug);
    await user2ArticlePage.deleteArticleButton.click();
  });
});

test("should add comment to an article", async ({
  loginPage,
  articlePage,
  userWithRandomArticle,
}) => {
  const comment = `${faker.lorem.sentence(5)} - comment - ${faker.string.nanoid(5)}`;

  await test.step("login with valid credentials", async () => {
    await loginPage.goto();
    await loginPage.login(
      userWithRandomArticle.user.email,
      userWithRandomArticle.user.password,
    );
    await articlePage.page.waitForLoadState("networkidle"); // Ensure the article page is fully loaded before proceeding
  });

  await test.step("add comment to the article", async () => {
    await articlePage.navigateToArticle(userWithRandomArticle.article.slug);
    await articlePage.commentInput.fill(comment);
    await articlePage.postCommentButton.click();
    await expect(articlePage.commentSection).toContainText(comment);
  });

  await test.step("delete the comment and verify it's removed", async () => {
    await articlePage.deleteComment(comment);
    await expect(articlePage.commentSection).not.toContainText(comment);
  });
});
