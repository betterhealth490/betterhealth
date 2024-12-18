import { By, until } from "selenium-webdriver";

export async function logout(driver) {
  try {
    await driver.findElement(By.css("button[data-sidebar='menu-button']")).click();
    await driver.sleep(2000); 

    const logoutButton = await driver.findElement(
      By.xpath("//div[contains(text(), 'Log out') and contains(@class, 'cursor-default')]")
    );
    await logoutButton.click();
    await driver.sleep(2000); 

    await driver.wait(until.urlIs("https://betterhealth.vercel.app/"), 5000);
    console.log("Logout successful! Redirected to homepage.");
  } catch (error) {
    throw new Error("Logout failed: " + error.message);
  }
}
