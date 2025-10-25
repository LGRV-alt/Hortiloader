import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";

test.describe("Check Login and Logout Flow", () => {
  test("Login Page", async ({ page }) => {
    // Landing Page Selector
    const logInButton = page.getByRole("link", { name: "Log In" });
    // Page selectors
    const signInButton = page.getByRole("button", { name: "Sign in" });

    // Helper Function for loggin in
    await login(page, "Testing", "Testing", "Password1");

    // Assert that log in worked
    const addOrderButton = page.getByRole("button", { name: "Add Order" });
    await expect(addOrderButton).toBeVisible({ timeout: 10000 });

    // Hit the button to show the dropdown menu and click logout
    await page.locator(".ml-2").click();
    await page.getByRole("button", { name: "Logout" }).click();

    // Assert that the page is back to the signin page
    await expect(logInButton).toBeVisible({ timeout: 10000 });
  });

  test("Login rejected with wrong credentials", async ({ page }) => {
    // Locator for the signin button
    const signInButton = page.getByRole("button", { name: "Sign in" });

    // Helper function with the wrong username passed into the input
    await login(page, "testing", "WrongUserName", "Password1");

    // Assert the login was failed and the user can still see the signin button
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });
});
