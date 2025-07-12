import { Page, expect } from "@playwright/test";

export async function login(page: Page) {
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
}
