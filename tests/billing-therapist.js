import { By, until } from "selenium-webdriver";

export async function checkBilling(driver) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await driver.findElement(By.css("button[data-sidebar='menu-button']")).click();
    console.log("Opened sidebar menu");
    await sleep(2000);

    const billingLink = await driver.findElement(By.xpath("//a[@href='/billing']"));
    await billingLink.click();
    console.log("Navigated to the Billing page");
    await sleep(2000);
    await driver.findElement(By.xpath("//button[contains(text(), 'Create Bill')]")).click();
    console.log("Clicked on 'Create Bill' button");
    await sleep(2000);
    const patientDropdown = await driver.findElement(By.xpath("//button[contains(@id, ':r1n:')]"));
    await patientDropdown.click();
    await sleep(1000);

    await driver.findElement(By.xpath("//span[text()='Patient Name']")).click();
    console.log("Selected a patient");
    await sleep(2000);

    const amountInput = await driver.findElement(By.xpath("//input[@type='number' and @name='amount']"));
    await amountInput.sendKeys("150.00");
    console.log("Entered bill amount: 150.00");
    await sleep(2000);

    const datePicker = await driver.findElement(By.xpath("//button[@id='date']"));
    await datePicker.click();
    await sleep(1000);

    await driver.findElement(By.xpath("//button[@aria-label='Friday, December 27th, 2024, selected']")).click();
    console.log("Selected date: December 27, 2024");
    await sleep(2000);

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();
    console.log("Submitted the bill");
    await sleep(3000);

    const successMessage = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'successfully')]")),
      5000
    );
    if (successMessage) {
      console.log("Bill created successfully!");
    } else {
      console.error("Failed to verify bill creation.");
    }
  } catch (error) {
    console.error("Error managing billing:", error);
  }
}
