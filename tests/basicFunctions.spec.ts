import { test, expect } from "@playwright/test";

test("Login Page", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  // Assertions that we are on the right page
  const title = page.getByRole("heading", { name: "Hortiloader" });
  const usernameInput = page.getByLabel("Username");
  const passwordInput = page.getByLabel("Password");
  await expect(title).toBeVisible();

  // Fill out login section
  await usernameInput.fill("Testing");
  await passwordInput.fill("Password1");

  // Hit Sign in button
  await page.getByRole("button", { name: "Sign in" }).click({ timeout: 10000 });

  // Assert that log in worked
  const addOrderButton = page.getByRole("button", { name: "Add Order" });
  await expect(addOrderButton).toBeVisible({ timeout: 10000 });

  // Assert we are back to the login page and successfully logged out
  // await expect(title).toBeVisible();
  // await expect(usernameInput).toBeVisible();
  // await expect(passwordInput).toBeVisible();
});

test.describe("Testing all the pages", () => {
  test.beforeEach("Login", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    // Assertions that we are on the right page
    const title = page.getByRole("heading", { name: "Hortiloader" });
    const usernameInput = page.getByLabel("Username");
    const passwordInput = page.getByLabel("Password");
    await expect(title).toBeVisible();
    // Fill out login section
    await usernameInput.fill("Testing");
    await passwordInput.fill("Password1");
    // Hit Sign in button
    const signInButton = page.getByRole("button", { name: "Sign in" });
    await signInButton.click({ force: true });
    // Assert that log in worked
    // const signoutButton = page.getByRole("button", { name: "Signout" });
    // await expect(signoutButton).toBeVisible({ timeout: 10000 });
  });

  test("check user entry page", async ({ page }) => {
    const data = {
      name: "lewis",
      postcode: "ka10",
      orderNumber: "1234",
      orderType: "retail",
      orderDay: "tuesday",
      boardType: "holding",
      week: "34",
    };
    // Navigate to the customer input page
    await page.getByRole("button", { name: "Add Order" }).click();

    // Selectors for the elements on the page
    const customerName = page.getByPlaceholder("Customer Name");
    const postcode = page.getByPlaceholder("Postcode");
    const orderNo = page.getByPlaceholder("Order No");
    const orderType = page.locator("#customerType");
    const orderDay = page.locator("#day");
    const boardType = page.locator("#boardPage");
    const weekInput = page.getByPlaceholder("Week");

    // Enter the data from object into elements
    await customerName.fill(data.name);
    await postcode.fill(data.postcode);
    await orderNo.fill(data.orderNumber);
    await orderType.selectOption(data.orderType);
    await orderDay.selectOption(data.orderDay);
    await boardType.selectOption(data.boardType);
    await weekInput.fill(data.week);

    // Assert the values have been passed over
    await expect(customerName).toHaveValue(data.name);
    await expect(postcode).toHaveValue(data.postcode);
    await expect(orderNo).toHaveValue(data.orderNumber);
    await expect(orderType).toHaveValue(data.orderType);
    await expect(orderDay).toHaveValue(data.orderDay);
    await expect(boardType).toHaveValue(data.boardType);
    await expect(weekInput).toHaveValue(data.week);
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
