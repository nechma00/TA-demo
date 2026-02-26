import { Page, Locator } from "@playwright/test";

export class ArticlePage {
  readonly page: Page;
  readonly loadingHeading: Locator;
  readonly noArticleHeading: Locator;
  readonly articleContainer: Locator;
  readonly articleTitleHeading: Locator;
  readonly followAuthorButton: Locator;
  readonly unfollowAuthorButton: Locator;
  readonly favoriteArticleButton: Locator;
  readonly unfavoriteArticleButton: Locator;
  readonly editArticleButton: Locator;
  readonly deleteArticleButton: Locator;
  readonly commentInput: Locator;
  readonly commentSection: Locator;
  readonly postCommentButton: Locator;
  readonly signInToCommentLink: Locator;
  readonly signUpToCommentLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingHeading = page.getByRole("heading", {
      name: "Loading article...",
    });
    this.noArticleHeading = page.getByRole("heading", {
      name: "No article found",
    });
    this.articleContainer = page.locator("app-article");
    this.articleTitleHeading = page.getByRole("heading", { level: 1 });
    this.followAuthorButton = page
      .getByRole("button", { name: /Follow\s+.+/ })
      .first();
    this.unfollowAuthorButton = page
      .getByRole("button", { name: /Unfollow\s+.+/ })
      .first();
    this.favoriteArticleButton = page
      .getByRole("button", { name: /Favorite Article/ })
      .first();
    this.unfavoriteArticleButton = page
      .getByRole("button", { name: /Unfavorite Article/ })
      .first();
    this.editArticleButton = page
      .getByRole("button", { name: "Edit Article" })
      .first();
    this.deleteArticleButton = page
      .getByRole("button", { name: "Delete Article" })
      .first();
    this.commentInput = page.getByPlaceholder("Write a comment...");
    this.commentSection = page.locator("app-article-comments");
    this.postCommentButton = page.getByRole("button", { name: "Post Comment" });
    this.signInToCommentLink = page.getByRole("link", { name: "Sign in" });
    this.signUpToCommentLink = page.getByRole("link", { name: "Sign up" });
  }

  async navigateToArticle(slug: string) {
    await this.page.goto(`${process.env.BASE_URL}/#/article/${slug}`);
  }

  async openEditArticle() {
    await this.editArticleButton.click();
  }

  async deleteArticle() {
    await this.deleteArticleButton.click();
  }

  async toggleFollowAuthor() {
    await this.followAuthorButton.isVisible();
    await this.followAuthorButton.click();
  }

  async toggleUnfollowAuthor() {
    await this.unfollowAuthorButton.isVisible();
    await this.unfollowAuthorButton.click();
  }

  async toggleFavoriteArticle() {
    if (await this.favoriteArticleButton.isVisible()) {
      await this.favoriteArticleButton.click();
      return;
    }

    if (await this.unfavoriteArticleButton.isVisible()) {
      await this.unfavoriteArticleButton.click();
    }
  }

  async addComment(comment: string) {
    await this.commentInput.fill(comment);
    await this.postCommentButton.click();
  }

  async deleteComment(comment: string) {
    const commentCard = this.page.locator(".card").filter({ hasText: comment });
    const deleteButton = commentCard.locator(".mod-options > .ion-trash-a");
    await deleteButton.click();
  }

  authorProfileLink(username: string): Locator {
    return this.page.getByRole("link", { name: username }).first();
  }

  articleTag(tag: string): Locator {
    return this.page.getByText(tag, { exact: true });
  }
}
