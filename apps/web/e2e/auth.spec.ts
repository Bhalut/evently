import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  const email = `test-${Date.now()}@example.com`;
  const password = "password123";

  test("should register a new user and redirect to login/home", async ({
    page,
  }) => {
    await page.goto("/register");

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);

    await page.click('button[type="submit"]');

    // Auto-login after registration should redirect to /events
    await expect(page).toHaveURL(/\/events/);
  });

  test("should login with existing user", async ({ page }) => {
    const uniqueEmail = `login-${Date.now()}@example.com`;

    // Register first to ensure user exists (since clean DB)
    await page.goto("/register");
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/events/);

    // New browser context to test login with fresh session
    const newContext = await page.context().browser()!.newContext();
    const newPage = await newContext.newPage();

    await newPage.goto("/login");
    await newPage.fill('input[type="email"]', uniqueEmail);
    await newPage.fill('input[type="password"]', password);
    await newPage.click('button[type="submit"]');

    await expect(newPage).toHaveURL(/\/events/);
  });
});
