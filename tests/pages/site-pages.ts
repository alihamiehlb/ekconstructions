import { Page, Locator } from "@playwright/test";

async function preparePage(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("ek-loader-seen", "1");
  });
}

export class HomePage {
  readonly page: Page;
  readonly hero: Locator;
  readonly servicesSection: Locator;
  readonly gallerySection: Locator;
  readonly contactSection: Locator;
  readonly getQuoteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hero = page.locator("#home");
    this.servicesSection = page.locator("#services");
    this.gallerySection = page.locator("#gallery");
    this.contactSection = page.locator("#contact");
    this.getQuoteButton = page.getByRole("link", { name: /get a quote/i }).first();
  }

  async goto() {
    await preparePage(this.page);
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
    await this.hero.waitFor({ state: "visible" });
  }
}

export class GalleryPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly filterGroup: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /project gallery/i });
    this.filterGroup = page.getByRole("group", { name: /filter projects by category/i });
  }

  async goto() {
    await preparePage(this.page);
    await this.page.goto("/gallery", { waitUntil: "domcontentloaded" });
    await this.heading.waitFor({ state: "visible" });
  }
}
