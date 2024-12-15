import { test, expect, Page } from "@playwright/test";

test.describe("Member Account Flow", () => {
  test("Create new member account then log out", async ({ page }) => {
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
    await page.click("text=user1124@example.com");
    await page.click("text=Log out");
  });

  test("Log into existing account", async ({ page }) => {
    await page.goto("https://betterhealth.vercel.app/");
    await page.click("text=Log In");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/login");
    await page.locator('input[name="email"]').fill("badamowicz0@berkeley.edu");
    await page.locator('input[name="password"]').fill("gN5,X#F(5X=DG7L");
    await page.click("text=Submit");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    await page.click("text=Surveys");
    await page.click("text=Table View");
  });

  test("Send message to therapist", async ({ page }) => {
    await page.goto("https://betterhealth.vercel.app/");
    await page.dblclick("text=Log in");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/login");
    await page.locator('input[name="email"]').fill("badamowicz0@berkeley.edu");
    await page.locator('input[name="password"]').fill("gN5,X#F(5X=DG7L");
    await page.dblclick("text=Submit");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    await page.click("text=Toggle Sidebar");
    await page.click("text=Inbox");
    await page.goto("https://betterhealth.vercel.app/inbox");
    await page.click("text=Send a message");
    await page.click("text=Select a therapist");
    await page.keyboard.press("Space");
    await page.getByPlaceholder("Enter your message").click();
    await page.keyboard.type("Please help me my health is deteriorating again");
    await page.getByRole("button", { name: "Send" }).click();
    await page.click("text=Please help me my health is deteriorating again");
  });

  test("Can show survey data and graph", async ({ page }) => {
    await page.goto("https://betterhealth.vercel.app/");
    await page.dblclick("text=Log in");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/login");
    await page.locator('input[name="email"]').fill("badamowicz0@berkeley.edu");
    await page.locator('input[name="password"]').fill("gN5,X#F(5X=DG7L");
    await page.dblclick("text=Submit");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    await page.click("text=Surveys");
    await page.click("text=Table View");
  });
});
