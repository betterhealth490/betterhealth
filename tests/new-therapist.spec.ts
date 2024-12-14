// 46TR16120400
import { test, expect } from "@playwright/test";

test.describe("Create Therapist Account", () =>{
    test("Enter therapist account information", async ({page}) =>{
      await page.goto("https://betterhealth.vercel.app/");
      await page.click("text=Sign Up");
      await expect(page).toHaveURL("https://betterhealth.vercel.app/signup");
      await page.click("text=Therapist");
      await expect(page).toHaveURL("https://betterhealth.vercel.app/signup");
      await page.locator('input[name="firstName"]').fill("Test");
      await page.locator('input[name="lastName"]').fill("Therapist");
      await page.locator('input[name="email"]').fill("therapist@example.com");
      await page.locator('input[name="password"]').fill("password1225");
      await page.locator('input[name="licenseNumber"]').fill("46TR16121800");
      await page.click("text=Submit");
      await expect(page).toHaveURL("https://betterhealth.vercel.app/startup");
      await page.getByPlaceholder("Enter your age").click();
      await page.getByPlaceholder("Enter your age").fill("35");
      await page.getByLabel("other").check();
      await expect(page.getByLabel("other")).toBeChecked();
      await page.getByLabel("LGBTQ+").check();
      await expect(page.getByLabel("LGBTQ+")).toBeChecked();
      await page.click("text=Submit");
      await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    })
})