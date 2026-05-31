import { test, expect } from "@playwright/test";
import { GalleryPage } from "../pages/site-pages";

test.describe("Gallery page", () => {
  let gallery: GalleryPage;

  test.beforeEach(async ({ page }) => {
    gallery = new GalleryPage(page);
    await gallery.goto();
  });

  test("renders gallery page heading", async () => {
    await expect(gallery.heading).toBeVisible();
  });

  test("shows empty or project grid", async () => {
    const section = gallery.showcase;
    await expect(section).toBeVisible();
    const cards = section.locator("article");
    if ((await cards.count()) > 0) {
      await expect(cards.first()).toBeVisible();
    } else {
      await expect(section.getByRole("heading", { name: /new project photos on the way/i })).toBeVisible();
    }
  });

  test("shows filters when multiple projects exist", async () => {
    const cards = gallery.showcase.locator("article");
    if ((await cards.count()) < 2) {
      test.skip(true, "Need at least two projects for category filters");
    }
    await expect(gallery.filterGroup).toBeVisible();
    await expect(gallery.filterGroup.getByRole("button", { name: /^All/i })).toBeVisible();
  });

  test("category filter updates URL and results", async ({ page }) => {
    const filters = gallery.filterGroup.getByRole("button");
    const count = await filters.count();
    test.skip(count < 2, "Need at least two categories to test filtering");

    const secondFilter = filters.nth(1);
    await secondFilter.click();

    await expect(secondFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.url()).toContain("category=");
  });

  test("project card links to detail page", async ({ page }) => {
    const firstCard = gallery.showcase.locator("article").first();
    test.skip((await firstCard.count()) === 0, "No gallery projects available");

    const href = await firstCard.locator("a").first().getAttribute("href");
    expect(href).toMatch(/^\/gallery\//);

    await firstCard.locator("a").first().click();
    await expect(page).toHaveURL(/\/gallery\//);
    await expect(page.getByRole("link", { name: /back to gallery/i })).toBeVisible();
  });
});
