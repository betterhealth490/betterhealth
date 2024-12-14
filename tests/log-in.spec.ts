import { test, expect } from "@playwright/test";

test.describe("Member Login Flow", () => {
  // test("Log into patient account", async ({page})=>{
  //     await page.goto("https://betterhealth.vercel.app/");
  //     await page.dblclick("text=Log in");
  //     await expect(page).toHaveURL("https://betterhealth.vercel.app/login");
  //     await page.locator('input[name="email"]').fill("kkillingswortht@bbb.org");
  //     await page.locator('input[name="password"]').fill("mO5<J7$!P");
  //     await page.dblclick("text=Submit");
  //     await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
  // })

  test("Send Message To Therapist", async ({ page }) => {
    await page.goto("https://betterhealth.vercel.app/");
    await page.dblclick("text=Log in");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/login");
    await page.locator('input[name="email"]').fill("kkillingswortht@bbb.org");
    await page.locator('input[name="password"]').fill("mO5<J7$!P");
    await page.dblclick("text=Submit");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    await page.goto("https://betterhealth.vercel.app/inbox");
    await page.click("text=Send a message");
    await page.click("text=Select a therapist");
    await page.keyboard.press("Space");
    await page.getByPlaceholder("Enter your message").click();
    await page.keyboard.type("Please help me my health is deteriorating");

    page.getByPlaceholder("Enter your message").click();
  });
});
