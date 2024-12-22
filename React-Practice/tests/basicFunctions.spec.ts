import { test, expect } from "@playwright/test";

test("Login Page", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  // Assertions that we are on the right page
  const title = page.getByRole("heading", { name: "Hortiloader" });
  const usernameInput = page.getByLabel("Username");
  const passwordInput = page.getByLabel("Password");
  await expect(title).toBeVisible();

  // Fill out login section
  await usernameInput.fill("Playwright");
  await passwordInput.fill("Password1");

  // Hit Sign in button
  await page.getByRole("button", { name: "Sign in" }).click();

  // Assert that log in worked
  const signoutButton = page.getByRole("button", { name: "Signout" });
  await expect(signoutButton).toBeVisible();
  await signoutButton.click();

  // Assert we are back to the login page and successfully logged out
  await expect(title).toBeVisible();
  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
});
