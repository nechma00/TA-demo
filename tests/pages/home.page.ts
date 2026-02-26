import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly conduitHeading: Locator;
  readonly taglineText: Locator;
  readonly homeNavLink: Locator;
  readonly signInNavLink: Locator;
  readonly signUpNavLink: Locator;
  readonly articlesFeed: Locator;
  readonly myFeedTab: Locator;
  readonly globalFeedTab: Locator;
  readonly noArticleHeading: Locator;
  readonly loadingArticlesMessage: Locator;
  readonly myProfileNavLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.conduitHeading = page.getByRole("heading", {
      name: "conduit",
      level: 1,
    });
    this.taglineText = page.getByText("A place to share your knowledge.");
    this.homeNavLink = page.getByRole("link", { name: "Home" });
    this.signInNavLink = page.getByRole("link", { name: "Sign in" });
    this.signUpNavLink = page.getByRole("link", { name: "Sign up" });
    this.articlesFeed = page.locator("app-articles-feed");
    this.myFeedTab = page.getByText("My Feed", { exact: true });
    this.globalFeedTab = page.getByText("Global Feed", { exact: true });
    this.noArticleHeading = page.getByRole("heading", {
      name: "No article found",
    });
    this.loadingArticlesMessage = page.getByText("Loading articles...");
    this.myProfileNavLink = page.getByRole("link", {
      name: "User profile image",
    });
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/#/`);
  }

  async openArticle(title: string) {
    const article = this.articlesFeed.getByRole("link", { name: title });
    await article.click();
  }

  async getArticleInFeed(title: string): Promise<Locator> {
    return this.page.locator("a").filter({ hasText: title });
  }

  async openMyProfile() {
    await this.myProfileNavLink.click();
  }

  async openSignIn() {
    await this.signInNavLink.click();
  }

  async openSignUp() {
    await this.signUpNavLink.click();
  }

  async switchToGlobalFeed() {
    await this.globalFeedTab.click();
  }

  async switchToMyFeed() {
    await this.myFeedTab.click();
  }
}
