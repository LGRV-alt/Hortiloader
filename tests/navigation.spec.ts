import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";
import { protectedURLRoutes, unprotectedRoutes } from "./fixtures/site-data";

test.describe("Unauthenticated route protection", () => {
  protectedURLRoutes.forEach((route) => {
    test(`Redirects unauthenticated user from /${route}`, async ({ page }) => {
      await page.goto(`http://localhost:5173/#/${route}`);
      const signInButton = page.getByRole("button", { name: "Sign in" });
      await expect(signInButton).toBeVisible({ timeout: 10000 });
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
