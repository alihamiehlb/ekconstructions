import { test, expect } from "@playwright/test";
import { GalleryPage } from "../pages/site-pages";

test.describe("Gallery page", () => {
  let gallery: GalleryPage;

  test.beforeEach(async ({ page }) => {
    gallery = new GalleryPage(page);
    await gallery.goto();
  });

  test("renders gallery heading and filters", async ({ page }) => {
    await expect(gallery.heading).toBeVisible();
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
    const firstCard = page.locator("#gallery article").first();
    test.skip((await firstCard.count()) === 0, "No gallery projects available");

    const href = await firstCard.locator("a").first().getAttribute("href");
    expect(href).toMatch(/^\/gallery\//);

    await firstCard.locator("a").first().click();
    await expect(page).toHaveURL(/\/gallery\//);
    await expect(page.getByRole("link", { name: /back to gallery/i })).toBeVisible();
  });
});
