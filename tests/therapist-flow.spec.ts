// 46TR16120400
import { test, expect } from "@playwright/test";

test.describe("Create Therapist Account", () => {
  test("Enter therapist account information and log out", async ({ page }) => {
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
    await page.click("text=therapist@example.com");
    await page.click("text=Log out");
  });

  test("Therapist can view patient surveys", async ({ page }) => {
    await page.goto("https://betterhealth.vercel.app/");
    await page.click("text=Log In");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/login");
    await page.locator('input[name="email"]').fill("tbrigginshawb@about.me");
    await page.locator('input[name="password"]').fill("sN8+uz6'}I/fp)");
    await page.click("text=Submit");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    await page.click("text=Surveys");
    await page.click("text=Table View");
    await page.click("text=Select a patient");
    await page.keyboard.press("Space");
  });

  test("Therapist can view and send message to patient", async ({ page }) => {
    await page.goto("https://betterhealth.vercel.app/");
    await page.click("text=Log In");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/login");
    await page.locator('input[name="email"]').fill("tbrigginshawb@about.me");
    await page.locator('input[name="password"]').fill("sN8+uz6'}I/fp)");
    await page.click("text=Submit");
    await expect(page).toHaveURL("https://betterhealth.vercel.app/dashboard");
    await page.click("text=Toggle Sidebar");
    await page.click("text=Inbox");
    await page.goto("https://betterhealth.vercel.app/inbox");
    await page.click("text=Please help me my health is deteriorating again");
    await page.click("text=Send a message");
    await page.click("text=Select a patient");
    await page.keyboard.press("Space");
    await page.getByPlaceholder("Enter your message").click();
    await page.keyboard.type(
      "Hello, please request an appointment and we can meet then",
    );
    await page.getByRole("button", { name: "Send" }).click();
    await page.click(
      "text=Hello, please request an appointment and we can meet then",
    );
  });
});
