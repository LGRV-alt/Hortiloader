import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export async function login(
  page: Page,
  orgName: string,
  username: string,
  password: string
) {
  await page.addInitScript(() => {
    localStorage.setItem("changelog_last_seen", "2026-01-10");
  });
  await page.goto("http://localhost:5173/");
  // Set the "already dismissed" state BEFORE loading the page

  // Now assert modal is NOT present
  await expect(page.locator("text=What's New")).not.toBeVisible();
  // ... rest of your test

  // Assign the title
  const landingPageTitle = page.getByRole("link", { name: "Hortiloader" });
  const LoginTitle = page.getByRole("heading", { name: "Hortiloader" });

  // Assign the locators for organization name, username and password
  const loginBtn = page.getByRole("link", { name: "Log In" });
  const orgNameInput = page.getByLabel("Organization Name");
  const usernameInput = page.getByLabel("Username");
  const passwordInput = page.getByLabel("Password");

  // Asset that we are on the correct page
  await expect(landingPageTitle).toBeVisible();
  await loginBtn.click();

  // Make sure its on the login page
  await expect(LoginTitle).toBeVisible();

  // Fill out login section
  await orgNameInput.fill(orgName);
  await usernameInput.fill(username);
  await passwordInput.fill(password);

  // Hit Sign in button
  const signInButton = page.getByRole("button", { name: "Sign in" });
  await signInButton.click();
}
