import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";
test.describe("Check Login and Logout Flow", () => {
  test("Login Page", async ({ page }) => {
    // Page selectors
    const signInButton = page.getByRole("button", { name: "Sign in" });

    // Helper Function for loggin in
    await login(page);

    // Hit the button to show the dropdown menu and click logout
    await page.locator(".ml-2").click();
    await page.getByRole("button", { name: "Logout" }).click();

    // Assert that the page is back to the signin page
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });
});
