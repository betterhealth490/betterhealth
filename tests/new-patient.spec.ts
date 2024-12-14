import { test, expect } from "@playwright/test";

test.describe("Member Signup Flow", () => {
  test.describe("Account creation", () => {
    test('Can create account', async ({ page }) => {
      await page.goto("https://betterhealth.vercel.app/");
      await page.click("text=Sign Up");
      await expect(page).toHaveURL("https://betterhealth.vercel.app/signup");
      await page.click("text=Member");
      await expect(page).toHaveURL("https://betterhealth.vercel.app/signup");
      await page.locator('input[name="firstName"]').fill("Test");
      await page.locator('input[name="lastName"]').fill("User");
      await page.locator('input[name="email"]').fill("user1124@example.com");
      await page.locator('input[name="password"]').fill("password122153345");
      await page.click("text=Submit");
      await expect(page).toHaveURL("https://betterhealth.vercel.app/startup");
      await page.getByLabel("18-24").check();
      await expect(page.getByLabel("18-24")).toBeChecked();
      await page.getByLabel("other").check();
      await expect(page.getByLabel("other")).toBeChecked();
      await page.getByLabel("LGBTQ+").check();
      await expect(page.getByLabel("LGBTQ+")).toBeChecked();
      await page.click("text=Submit");
      await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    });
  });

  // test("Can fill out survey", async ({ page }) => {
  //   expect(page).toHaveURL("https://betterhealth.vercel.app/startup");
  //   await page.getByLabel("18-24").check();
  //   await expect(page.getByLabel("18-24")).toBeChecked();
  //   await page.getByLabel("other").check();
  //   await expect(page.getByLabel("other")).toBeChecked();
  //   await page.getByLabel("LGBTQ+").check();
  //   await expect(page.getByLabel("LGBTQ+")).toBeChecked();
  //   await page.click("text=Submit");
  //   await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
  // });
});
