import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/site-pages";

test.describe("Homepage", () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.goto();
  });

  test("renders hero with headline and primary CTAs", async ({ page }) => {
    await expect(home.hero).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(home.getQuoteButton).toBeVisible();
    await expect(page.getByRole("link", { name: /view our work/i }).first()).toBeVisible();
  });

  test("loads hero background image", async ({ page }) => {
    const heroImg = page.locator("#home img:visible");
    await expect(heroImg).toHaveCount(1);
    const src = await heroImg.getAttribute("src");
    expect(src).toMatch(/hero-home/);
  });

  test("navigates to contact from hero CTA", async ({ page }) => {
    await home.getQuoteButton.click();
    await expect(home.contactSection).toBeInViewport();
  });

  test("shows services section without desktop background bleed", async ({ page, viewport }) => {
    test.skip(!viewport || viewport.width < 1024, "Desktop-only check");
    await home.servicesSection.scrollIntoViewIfNeeded();
    await expect(home.servicesSection.getByRole("heading", { name: "Services" })).toBeVisible();
    await expect(home.servicesSection.locator('img[src*="hero-building"]')).toBeHidden();
  });

  test("homepage gallery when present", async ({ page }) => {
    const gallery = page.locator("#gallery");
    await expect(gallery).toBeVisible();

    const cards = gallery.locator("article");
    if ((await cards.count()) === 0) {
      await expect(
        gallery.getByRole("heading", { name: /new project photos on the way/i }),
      ).toBeVisible();
      return;
    }

    await gallery.scrollIntoViewIfNeeded();
    await expect(cards.first()).toBeVisible();
  });
});
