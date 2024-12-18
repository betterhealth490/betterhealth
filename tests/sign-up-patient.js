import { Builder, By, Key, until } from "selenium-webdriver";

export async function signupPatient(driver) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await driver.get("http://localhost:3000/");
    console.log("Navigated to the website");
    await sleep(2000);

    await driver.findElement(By.xpath("//button[text()='Sign Up']")).click();
    console.log("Navigated to Sign Up page");
    await sleep(2000);

    const memberButton = await driver.findElement(
      By.xpath(
        "//button[contains(@class, 'text-xl') and contains(., 'Member')]",
      ),
    );
    await memberButton.click();
    console.log("Selected 'Member' role");
    await sleep(2000);

    await driver.findElement(By.name("firstName")).sendKeys("John");
    await sleep(2000);
    await driver.findElement(By.name("lastName")).sendKeys("Doe");
    await sleep(2000);
    await driver.findElement(By.name("email")).sendKeys("johndoe2@example.com");
    await sleep(2000);
    await driver.findElement(By.name("password")).sendKeys("Password123!");
    console.log("Filled out the form");
    await sleep(2000);

    await driver
      .findElement(By.xpath("//button[@type='submit' and text()='Submit']"))
      .click();
    console.log("Submitted the initial signup form");
    await sleep(2000);

    const ageButton = await driver.findElement(
      By.xpath("/html/body/div[1]/div/form/div/div[2]/div[1]/div/div[3]/label"),
    );
    await ageButton.click();
    console.log("Selected Age: 35-44");
    await sleep(2000);

    const genderButton = await driver.findElement(
      By.xpath("/html/body/div[1]/div/form/div/div[2]/div[2]/div/div[1]/label"),
    );
    await genderButton.click();
    console.log("Selected Gender: Male");
    await sleep(2000);

    const specialtyButton = await driver.findElement(
      By.xpath("/html/body/div[1]/div/form/div/div[2]/div[3]/div/div[2]/label"),
    );
    await specialtyButton.click();
    console.log("Selected Specialty: Addiction");
    await sleep(2000);

    await driver
      .findElement(By.xpath("//button[@type='submit' and text()='Submit']"))
      .click();
    console.log("Submitted the final signup form");
    await sleep(2000);

    await driver.wait(until.urlContains("dashboard"), 5000);
    console.log("Signup successful! Redirected to dashboard.");
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  }
}