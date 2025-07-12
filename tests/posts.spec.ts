import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";

test.describe("CRUD Tests", () => {
  test.beforeEach("Log the user in", async ({ page }) => {
    await login(page);
  });
  test("Create, Update and Delete a task", async ({ page }) => {
    // Data to be inputted to the form
    const data = {
      name: "test",
      postcode: "g77 5us",
      orderNumber: "1234",
      orderType: "wholesale",
      orderDay: "wednesday",
    };

    // Updated data to check the tasks can be updated
    const updatedData = {
      name: "test updated",
      postcode: "ka10 6un",
      orderNumber: "4321",
      orderType: "retail",
      orderDay: "friday",
    };

    // Selectors for the form input fields
    const customerName = page.getByPlaceholder("Customer Name");
    const postcode = page.getByPlaceholder("Postcode");
    const orderNo = page.getByPlaceholder("Order No");
    const orderType = page.locator("#customerType");
    const orderDay = page.locator("#day").first();

    // Selectors for the create page
    const createSave = page.getByRole("button", { name: "Save" });
    const deleteTask = page.getByRole("button", { name: "Delete" });

    // Page Selectors
    const addOrderButton = page.getByRole("button", { name: "Add Order" });
    const weekdayHeading = page.getByRole("heading", { name: "Monday" });

    // Navigate to the create order page
    await addOrderButton.click();

    // Fill out the form
    await customerName.fill(data.name);
    await postcode.fill(data.postcode);
    await orderNo.fill(data.orderNumber);
    await orderType.selectOption(data.orderType);
    await orderDay.selectOption(data.orderDay);

    // Save the task
    await createSave.click();

    // Create the string for the task based on the inputted data
    let task = `${data.name} ${data.postcode.toUpperCase()}`;

    // Assert that the task has been created
    await expect(page.getByRole("link", { name: task })).toBeVisible();

    // Move back into the created task to update it
    await page.getByRole("link", { name: task }).click();

    // Fill the form in with the updated data
    await customerName.fill(updatedData.name);
    await postcode.fill(updatedData.postcode);
    await orderNo.fill(updatedData.orderNumber);
    await orderType.selectOption(updatedData.orderType);
    await orderDay.selectOption(updatedData.orderDay);

    // Save the task
    await createSave.click();

    // Create the string for the task based on the updated data
    task = `${updatedData.name} ${updatedData.postcode.toUpperCase()}`;

    // Assert that the task has been updated
    await expect(page.getByRole("link", { name: task })).toBeVisible();

    // Move back into the created task to update it
    await page.getByRole("link", { name: task }).click();

    // Handle deleteing the task
    await deleteTask.click();
    await page.locator(".fixed > .bg-white > .w-full").fill("testing");
    await page.getByRole("button", { name: "Confirm Delete" }).click();

    // Assert the user is back to the main page and the task is no longer there
    await expect(weekdayHeading).toBeVisible();
    await expect(page.getByRole("link", { name: task })).toHaveCount(0);
  });
});
