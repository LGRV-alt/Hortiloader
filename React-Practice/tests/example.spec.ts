import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByLabel("Username").fill("Playwright");
  await page.getByLabel("Password").fill("Password1");
});
