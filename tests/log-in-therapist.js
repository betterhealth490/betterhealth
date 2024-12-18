import { By, until } from "selenium-webdriver";

export async function logintherapist(driver, email, password) {
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

    const patientsTab = await driver.findElement(By.xpath("//button[text()='Patients']"));
    await patientsTab.click();
    console.log("Navigated to Patients section");
    await driver.sleep(2000); 
  } catch (error) {
    throw new Error("Login or navigation failed: " + error.message);
  }
}

