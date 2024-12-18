import { Builder, By, Key, until } from "selenium-webdriver";

async function testTherapistSignup() {
  let driver = new Builder().forBrowser("chrome").build();

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {

    await driver.get("https://betterhealth.vercel.app/");
    console.log("Navigated to the website");
    await sleep(2000);
    await driver.findElement(By.xpath("//button[text()='Sign Up']")).click();
    console.log("Navigated to Sign Up page");
    await sleep(2000);

    const therapistButton = await driver.findElement(
      By.xpath("//button[contains(@class, 'text-xl') and contains(., 'Therapist')]")
    );
    await therapistButton.click();
    console.log("Selected 'Therapist' role");
    await sleep(2000);

    await driver.findElement(By.name("firstName")).sendKeys("Jane");
    await driver.findElement(By.name("lastName")).sendKeys("Smith");
    await driver.findElement(By.name("email")).sendKeys("janesmith3@example.com");
    await driver.findElement(By.name("password")).sendKeys("Therapist123!");
    await driver.findElement(By.name("licenseNumber")).sendKeys("46TR69699000");
    console.log("Filled out basic form fields");
    await sleep(2000);

    await driver
    .findElement(By.xpath("//button[@type='submit' and text()='Submit']"))
    .click();
    console.log("Submitted the initial signup form");
    await sleep(2000);

    await driver.findElement(By.xpath("//input[@name='age']")).sendKeys("40");
    console.log("Entered Age: 40");
    await sleep(2000);


    const genderButton = await driver.findElement(By.xpath("//button[@value='male']"));
    await genderButton.click();
    console.log("Selected Gender: Male");
    await sleep(2000);

    const specialtyButton = await driver.findElement(By.xpath("//button[@value='addiction']"));
    await specialtyButton.click();
    console.log("Selected Specialty: Addiction");
    await sleep(2000);

    await driver
      .findElement(By.xpath("//button[@type='submit' and text()='Submit']"))
      .click();
    console.log("Submitted the final signup form");
    await sleep(2000);

    await driver.wait(until.urlContains("dashboard"), 5000);
    console.log("Therapist signup successful! Redirected to dashboard.");

  } catch (error) {
    console.error("Test failed due to error:", error);
  } finally {
    await driver.quit();
  }
}

testTherapistSignup();
