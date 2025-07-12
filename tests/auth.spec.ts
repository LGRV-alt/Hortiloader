import { test, expect } from "@playwright/test";
test.describe("Check Login and Logout Flow", () => {
  test("Login Page", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    // Assign the title
    const title = page.getByRole("heading", { name: "Hortiloader" });

    // Assign the locators for username and password
    const usernameInput = page.getByLabel("Username");
    const passwordInput = page.getByLabel("Password");

    // Asset that we are on the correct page
    await expect(title).toBeVisible();

    // Fill out login section
    await usernameInput.fill("Testing");
    await passwordInput.fill("Password1");

    // Hit Sign in button
    const signInButton = page.getByRole("button", { name: "Sign in" });
    await signInButton.click();

    // Assert that log in worked
    const addOrderButton = page.getByRole("button", { name: "Add Order" });
    await expect(addOrderButton).toBeVisible({ timeout: 10000 });

    // Hit the button to show the dropdown menu and click logout
    await page.locator(".ml-2").click();
    await page.getByRole("button", { name: "Logout" }).click();

    // Assert that the page is back to the signin page
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });
});
