import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";
import { protectedURLRoutes, unprotectedRoutes } from "./fixtures/site-data";

test.describe("Check Login and Logout Flow", () => {
  test("Login Page", async ({ page }) => {
    // Page selectors
    const signInButton = page.getByRole("button", { name: "Sign in" });

    // Helper Function for loggin in
    await login(page, "Testing", "Password1");

    // Assert that log in worked
    const addOrderButton = page.getByRole("button", { name: "Add Order" });
    await expect(addOrderButton).toBeVisible({ timeout: 10000 });

    // Hit the button to show the dropdown menu and click logout
    await page.locator(".ml-2").click();
    await page.getByRole("button", { name: "Logout" }).click();

    // Assert that the page is back to the signin page
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });

  test("Login rejected with wrong credentials", async ({ page }) => {
    // Locator for the signin button
    const signInButton = page.getByRole("button", { name: "Sign in" });

    // Helper function with the wrong username passed into the input
    await login(page, "WrongUserName", "Password1");

    // Assert the login was failed and the user can still see the signin button
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });

  test.describe("Unauthenticated route protection", () => {
    protectedURLRoutes.forEach((route) => {
      test(`Redirects unauthenticated user from /${route}`, async ({
        page,
      }) => {
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
});
