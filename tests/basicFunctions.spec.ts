import { test, expect } from "@playwright/test";

test("Login Page", async ({ page }) => {
  await page.goto("http://localhost:5174/");
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
  // await expect(signoutButton).toBeVisible();
  await signoutButton.click();

  // Assert we are back to the login page and successfully logged out
  await expect(title).toBeVisible();
  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
});

test.describe("Testing all the pages", () => {
  test.beforeEach("Login", async ({ page }) => {
    await page.goto("http://localhost:5174/");
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
  });
});

// test.describe("CRUD Tests", () => {
//   test.beforeEach("Login", async ({ page }) => {
//     await page.goto("http://localhost:5173/");
//     // Assertions that we are on the right page
//     const title = page.getByRole("heading", { name: "Hortiloader" });
//     const usernameInput = page.getByLabel("Username");
//     const passwordInput = page.getByLabel("Password");
//     await expect(title).toBeVisible();
//     // Fill out login section
//     await usernameInput.fill("Playwright");
//     await passwordInput.fill("Password1");
//     // Hit Sign in button
//     await page.getByRole("button", { name: "Sign in" }).click();
//   });

//   test("Adding customer info", async ({ page }) => {
//     // Fill out the customer information
//     await page.getByRole("button", { name: "Add Order" }).click();
//     const orderType = page.locator("#customerType");
//     await orderType.selectOption("retail");
//     await page.getByPlaceholder("Customer Name").fill("John Doe");
//     await page.getByPlaceholder("Postcode").fill("KA10 7AZ");
//     await page.getByPlaceholder("Order No").fill("09890");
//     await page.getByRole("button", { name: "save" }).click();

//     // Assert the new entry appears on the whiteboard
//     const newEntry = page.getByText("John Doe");
//     await expect(newEntry).toBeVisible();
//     await newEntry.click();

//     // Handle the browser popup asking for a password
//     page.on("dialog", async (dialog) => {
//       console.log(`Dialog message: ${dialog.message()}`);
//       await dialog.accept("Gilmore");
//     });
//     // Triggers the popup
//     await page.getByRole("button", { name: "x" }).click();
//   });
// });
