import { test, expect } from "@playwright/test";

test.describe("CRUD Tests", () => {
  test.beforeEach("Log the user in", async ({ page }) => {
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
  });
  test("Create an order", async ({ page }) => {
    await page.getByRole("button", { name: "Add Order" }).click();
    await page.getByPlaceholder("Customer Name").click();
    await page.getByPlaceholder("Customer Name").fill("test");
    await page.getByPlaceholder("Postcode").click();
    await page.getByPlaceholder("Postcode").fill("g77 5us");
    await page.getByPlaceholder("Order No.").click();
    await page.getByPlaceholder("Order No.").fill("1234");
    await page.locator("#day").selectOption("wednesday");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("link", { name: "test G77 5US" })
    ).toBeVisible();
    await page.getByRole("link", { name: "test G77 5US" }).click();
    await page.getByPlaceholder("Customer Name").click();
    await page.getByPlaceholder("Customer Name").fill("test updated");
    await page.getByPlaceholder("Postcode").click();
    await page.getByPlaceholder("Postcode").fill("ka10 9ld");
    await page.getByPlaceholder("Order No.").click();
    await page.getByPlaceholder("Order No.").fill("6666");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("link", { name: "test updated KA10 9LD" })
    ).toBeVisible();
    await page.getByRole("link", { name: "test updated KA10 9LD" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await page.locator(".fixed > .bg-white > .w-full").click();
    await page.locator(".fixed > .bg-white > .w-full").fill("testing");
    await page.getByRole("button", { name: "Confirm Delete" }).click();
  });
});
