import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";
import { taskData, updatedTaskData } from "./fixtures/site-data";
import type { Page } from "@playwright/test";

test.describe("CRUD Tests", () => {
  test.beforeEach("Log the user in", async ({ page }) => {
    await login(page, "Testing", "Testing", "Password1");
    await page.waitForTimeout(5000); // 5s Pause
  });

  test("Create, Update and Delete a task", async ({ page }) => {
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
    await customerName.fill(taskData.name);
    await postcode.fill(taskData.postcode);
    await orderNo.fill(taskData.orderNumber);
    await orderType.selectOption(taskData.orderType);
    await orderDay.selectOption(taskData.orderDay);

    // Save the task
    await createSave.click();

    // Create the string for the task based on the inputted data
    let task = `${taskData.name} ${taskData.postcode.toUpperCase()}`;

    // Assert that the task has been created
    await expect(page.getByRole("link", { name: task })).toBeVisible();

    // Move back into the created task to update it
    await page.getByRole("link", { name: task }).click();

    // Fill the form in with the updated data
    await customerName.fill(updatedTaskData.name);
    await postcode.fill(updatedTaskData.postcode);
    await orderNo.fill(updatedTaskData.orderNumber);
    await orderType.selectOption(updatedTaskData.orderType);
    await orderDay.selectOption(updatedTaskData.orderDay);

    // Save the task
    await createSave.click();

    // Create the string for the task based on the updated data
    task = `${updatedTaskData.name} ${updatedTaskData.postcode.toUpperCase()}`;

    // Assert that the task has been updated
    await expect(page.getByRole("link", { name: task })).toBeVisible();

    // Move back into the created task to update it
    await page.getByRole("link", { name: task }).click();

    // Handle deleteing the task
    await deleteTask.click();
    await page.locator(".fixed > .bg-white > .w-full").fill("testing-testing");
    await page.getByRole("button", { name: "Confirm Delete" }).click();

    // Assert the user is back to the main page and the task is no longer there
    await expect(weekdayHeading).toBeVisible();
    await expect(page.getByRole("link", { name: task })).toHaveCount(0);
  });
});
