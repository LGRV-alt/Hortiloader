import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";
import { protectedURLRoutes, unprotectedRoutes } from "./fixtures/site-data";
import type { Page } from "@playwright/test";

test.describe("Unauthenticated route protection", () => {
  protectedURLRoutes.forEach((route) => {
    test(`Redirects unauthenticated user from /${route}`, async ({ page }) => {
      await page.goto(`http://localhost:5173/#/${route}`);
      const signInButton = page.getByRole("button", { name: "Sign in" });
      await expect(signInButton).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(3000); // 5s Pause
    });
  });
});

test.describe("Unauthenticated route allowed cases", () => {
  unprotectedRoutes.forEach((route) => {
    test(`allow unauthenticated access to /${route}`, async ({ page }) => {
      await page.goto(`http://localhost:5173/#/${route}`);
      const signInButton = page.getByRole("button", { name: "Sign in" });
      await expect(signInButton).not.toBeVisible();
    });
  });
});

test.describe("Authenticated Routes", () => {
  protectedURLRoutes.forEach((route) => {
    test(`Authenticated route for /${route}`, async ({ page }) => {
      await login(page, "Testing", "Testing", "Password1");
      await page.waitForTimeout(3000); // 5s Pause

      // Confirm login worked
      await expect(page.getByRole("button", { name: "Add Order" })).toBeVisible(
        { timeout: 10000 }
      );

      // Navigate to the route
      await page.goto(`http://localhost:5173/#/${route}`, {
        waitUntil: "networkidle",
      });

      // Assert user stays on correct route
      await expect(page).toHaveURL(new RegExp(`#/${route}`));

      // confirm login screen is NOT visible
      await expect(
        page.getByRole("button", { name: "Sign in" })
      ).not.toBeVisible();
    });
  });
});
