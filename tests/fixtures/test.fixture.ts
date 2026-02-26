import {
  request,
  test as base,
  expect,
  APIRequestContext,
} from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { LoginPage } from "../pages/login.page";
import { SignupPage } from "../pages/signup.page";
import { EditorPage } from "../pages/editor.page";
import { SettingsPage } from "../pages/settings.page";
import { ArticlePage } from "../pages/article.page";
import { faker } from "@faker-js/faker/locale/zu_ZA";

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  editorPage: EditorPage;
  settingsPage: SettingsPage;
  articlePage: ArticlePage;
  newUser: { username: string; email: string; password: string; token: string };
  userWithRandomArticle: {
    user: { username: string; email: string; password: string; token: string };
    article: {
      title: string;
      description: string;
      body: string;
      tagList: string[];
      author: { username: string; email: string };
      slug: string;
    };
  };
  twoUsersSetup: {
    user1: {
      username: string;
      email: string;
      password: string;
      token: string;
      article: {
        title: string;
        description: string;
        body: string;
        tagList: string[];
        author: { username: string; email: string };
        slug: string;
      };
    };
    user2: {
      username: string;
      email: string;
      password: string;
      token: string;
      article: {
        title: string;
        description: string;
        body: string;
        tagList: string[];
        author: { username: string; email: string };
        slug: string;
      };
    };
  };
};

let requestContext: APIRequestContext;

export async function createUser(
  username: string = `user_${faker.string.nanoid(8)}`,
  email: string = `${username}@example.com`,
  password: string = `${process.env.PASSWORD || "password123"}_${faker.string.nanoid(8)}`,
) {
  requestContext = await request.newContext({
    baseURL: process.env.API_URL || "http://localhost:8000",
  });
  const response = await requestContext.post("/api/users", {
    data: {
      user: { username: `user_${faker.string.nanoid(8)}`, email, password },
    },
  });
  expect(response.status()).toBe(201);
  return { userinfo: JSON.parse(await response.text()), password: password };
}

export async function addArticle(
  token: string,
  title: string = `AT - ${faker.lorem.sentence()} - ${faker.string.nanoid(8)}`,
  description: string = `${faker.lorem.sentence()} - ${faker.string.nanoid(8)}`,
  body: string = `${faker.lorem.paragraphs(3)} - ${faker.string.nanoid(8)}`,
  tagList: string[] = ["generated", "playwright"],
) {
  const response = await requestContext.post("/api/articles", {
    data: { article: { title, description, body, tagList } },
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  expect(response.status()).toBe(201);
  const data = JSON.parse(await response.text());
  return {
    article: {
      title: data.article.title,
      description: data.article.description,
      body: data.article.body,
      tagList: data.article.tagList,
      author: {
        username: data.article.author.username,
        email: data.article.author.email,
      },
      slug: data.article.slug,
    },
  };
}

export async function deleteArticle(token: string, slug: string) {
  const response = await requestContext.delete(`/api/articles/${slug}`, {
    headers: { Authorization: `Token ${token}` },
  });

  // article might already be deleted by the test itself
  expect([204, 404]).toContain(response.status());
}

export const test = base.extend<Fixtures>({
  newUser: async ({}, use) => {
    const requestContext = await request.newContext({
      baseURL: process.env.API_URL || "http://localhost:8000",
    });
    const response = await createUser();
    const user = response.userinfo.user;

    await use({
      username: user.username,
      email: user.email,
      password: response.password,
      token: user.token,
    });
  },

  userWithRandomArticle: async ({ newUser }, use) => {
    const article = await addArticle(
      newUser.token,
      `AT - random - ${faker.lorem.sentence()} - ${faker.string.nanoid(8)}`,
      `${faker.lorem.sentence()} - ${faker.string.nanoid(8)}`,
      `${faker.lorem.paragraphs(3)} - ${faker.string.nanoid(8)}`,
    );

    await use({
      user: newUser,
      article: { ...article.article },
    });

    await deleteArticle(newUser.token, article.article.slug);
  },

  twoUsersSetup: async ({}, use) => {
    const user1 = await createUser();
    const user1Article = await addArticle(
      user1.userinfo.user.token,
      `AT - user1 - ${faker.lorem.sentence()} - ${faker.string.nanoid(8)}`,
      `${faker.lorem.sentence()} - ${faker.string.nanoid(8)}`,
      `${faker.lorem.paragraphs(3)} - ${faker.string.nanoid(8)}`,
    );
    const user2 = await createUser();
    const user2Article = await addArticle(
      user2.userinfo.user.token,
      `AT - user2 - ${faker.lorem.sentence()} - ${faker.string.nanoid(8)}`,
      `${faker.lorem.sentence()} - ${faker.string.nanoid(8)}`,
      `${faker.lorem.paragraphs(3)} - ${faker.string.nanoid(8)}`,
    );
    await use({
      user1: {
        username: user1.userinfo.user.username,
        email: user1.userinfo.user.email,
        token: user1.userinfo.user.token,
        password: user1.password,
        article: { ...user1Article.article },
      },
      user2: {
        username: user2.userinfo.user.username,
        email: user2.userinfo.user.email,
        token: user2.userinfo.user.token,
        password: user2.password,
        article: { ...user2Article.article },
      },
    });
    await deleteArticle(user1.userinfo.user.token, user1Article.article.slug);
    await deleteArticle(user2.userinfo.user.token, user2Article.article.slug);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  editorPage: async ({ page }, use) => {
    await use(new EditorPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },
});

export { expect } from "@playwright/test";
