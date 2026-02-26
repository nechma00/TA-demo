import { Page, Locator } from '@playwright/test';

export class EditorPage {
  readonly page: Page;
  readonly articleEditorHeading: Locator;
  readonly articleTitleInput: Locator;
  readonly articleDescriptionInput: Locator;
  readonly articleBodyInput: Locator;
  readonly articleTagInput: Locator;
  readonly publishArticleButton: Locator;
  readonly publishSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.articleEditorHeading = page
      .getByRole('heading', { name: 'Article editor', level: 1 });
    this.articleTitleInput = page.getByPlaceholder('Article Title');
    this.articleDescriptionInput = page.getByPlaceholder("What's this article about?");
    this.articleBodyInput = page.getByPlaceholder('Write your article (in markdown)');
    this.articleTagInput = page.getByPlaceholder('Enter tags');
    this.publishArticleButton = page.getByRole('button', { name: 'Publish Article' });
    this.publishSuccessMessage = page.getByText('Published successfully!');
  }

  async navigateToArticleEditor() {
    await this.page.goto(`${process.env.BASE_URL}/#/editor`);
  }

  async navigateToExistingArticle(article: string) {
    await this.page.goto(`${process.env.BASE_URL}/#/editor/${article}`);
  }

  async fillArticleForm(data: { title?: string; description?: string; body?: string }) {
    if (data.title !== undefined) {
      await this.articleTitleInput.fill(data.title);
    }

    if (data.description !== undefined) {
      await this.articleDescriptionInput.fill(data.description);
    }

    if (data.body !== undefined) {
      await this.articleBodyInput.fill(data.body);
    }
  }

  async addTag(tag: string) {
    await this.articleTagInput.fill(tag);
    await this.articleTagInput.press('Enter');
  }

  async publishArticle() {
    await this.publishArticleButton.click();
  }
}
