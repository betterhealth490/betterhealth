import { test, expect } from "@playwright/test";

test.describe("Show survey data", () => {
  test("Can show survey data and graph", async ({ page }) => {
    await page.goto("https://betterhealth.vercel.app/");
    await page.dblclick("text=Log in");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/login");
    await page.locator('input[name="email"]').fill("kkillingswortht@bbb.org");
    await page.locator('input[name="password"]').fill("mO5<J7$!P");
    await page.dblclick("text=Submit");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    await page.click("text=Surveys");
    await page.click("text=Table View");
  });
});
