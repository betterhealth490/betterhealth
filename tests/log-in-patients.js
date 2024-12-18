import { By, until } from "selenium-webdriver";

export async function login(driver, email, password) {
  try {
    await driver.get("https://betterhealth.vercel.app/");
    await driver.sleep(2000); 

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();
    await driver.sleep(2000);

    await driver.wait(until.elementLocated(By.xpath("//input[@name='email']")), 5000);

    const emailInput = await driver.findElement(By.xpath("//input[@name='email']"));
    await emailInput.sendKeys(email);
    await driver.sleep(2000);

    const passwordInput = await driver.findElement(By.xpath("//input[@name='password']"));
    await passwordInput.sendKeys(password);
    await driver.sleep(2000); 

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();
    await driver.sleep(2000); 

    await driver.wait(until.elementLocated(By.css("button[data-sidebar='menu-button']")), 5000);
    console.log("Login successful!");
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
}
