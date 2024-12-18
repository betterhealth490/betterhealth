import { Builder, By, Key, until } from "selenium-webdriver";

async function testLoginAndLogout() {
  let driver = new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 15000,
  });
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await driver.get("https://betterhealth.vercel.app/");

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@name='email']")),
      5000,
    );

    const emailInput = await driver.findElement(
      By.xpath("//input[@name='email']"),
    );
    await emailInput.sendKeys("badamowicz0@berkeley.edu");

    const passwordInput = await driver.findElement(
      By.xpath("//input[@name='password']"),
    );
    await passwordInput.sendKeys("gN5,X#F(5X=DG7L");

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();

    await driver.wait(
      until.elementLocated(By.css("button[data-sidebar='menu-button']")),
      5000,
    );
    console.log("Login successful!");

    await driver
      .findElement(By.css("button[data-sidebar='menu-button']"))
      .click();

    const logoutButton = await driver.findElement(
      By.xpath(
        "//div[contains(text(), 'Log out') and contains(@class, 'cursor-default')]",
      ),
    );

    await logoutButton.click();
    console.log("Logout successful!");

    await driver.wait(until.urlIs("https://betterhealth.vercel.app/"), 5000);
    console.log("Redirected to homepage after logout.");
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

async function testTakeAndShowSurveyData() {
  let driver = new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 15000,
  });
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await driver.get("https://betterhealth.vercel.app/");

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@name='email']")),
      5000,
    );

    const emailInput = await driver.findElement(
      By.xpath("//input[@name='email']"),
    );
    await emailInput.sendKeys("kbeville4@opensource.org");

    const passwordInput = await driver.findElement(
      By.xpath("//input[@name='password']"),
    );
    await passwordInput.sendKeys("cO4`W@}4");

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();
    try {
      await driver
        .findElement(By.xpath("/html/body/div[1]/div[2]/div[1]/button"))
        .click();

      await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
      await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
      await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
      await driver.findElement(By.xpath("//button[text()='Submit']")).click();
    } catch (error) {
      console.log("Already completed survey");
    }

    await driver.findElement(By.xpath("//button[text()='Surveys']")).click();
    sleep(5000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div[2]/div[2]/div/div[3]/div/div[1]/div[1]/div/button",
        ),
      )
      .click();
    sleep(5000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[4]/div/div/div/div/table/tbody/tr[3]/td[4]/button",
        ),
      )
      .click();
    sleep(5000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div[2]/div[2]/div/div[3]/div/div[1]/div[1]/div/button",
        ),
      )
      .click();
    sleep(5000);
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

async function testShowSurveyGraph() {
  let driver = new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 15000,
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // Patient
    await driver.get("https://betterhealth.vercel.app/");

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@name='email']")),
      5000,
    );

    const emailInput = await driver.findElement(
      By.xpath("//input[@name='email']"),
    );
    await emailInput.sendKeys("badamowicz0@berkeley.edu");

    const passwordInput = await driver.findElement(
      By.xpath("//input[@name='password']"),
    );
    await passwordInput.sendKeys("gN5,X#F(5X=DG7L");

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Surveys']")),
      5000,
    );
    console.log("Login successful!");

    await driver.findElement(By.xpath("//button[text()='Surveys']")).click();

    const tableView = await driver.findElement(
      By.xpath("//button[contains(text(), 'Table View')]"),
    );

    await tableView.click();
    console.log("Table view successful!");
    await driver
      .findElement(By.css("button[data-sidebar='menu-button']"))
      .click();

    const logoutButton = await driver.findElement(
      By.xpath(
        "//div[contains(text(), 'Log out') and contains(@class, 'cursor-default')]",
      ),
    );

    await logoutButton.click();
    console.log("Logout successful!");

    await driver.wait(until.urlIs("https://betterhealth.vercel.app/"), 5000);
    console.log("Redirected to homepage after logout.");

    // Therapist
    await driver.get("https://betterhealth.vercel.app/");

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@name='email']")),
      5000,
    );

    const emailInput1 = await driver.findElement(
      By.xpath("//input[@name='email']"),
    );
    await emailInput1.sendKeys("tbrigginshawb@about.me");

    const passwordInput1 = await driver.findElement(
      By.xpath("//input[@name='password']"),
    );
    await passwordInput1.sendKeys("sN8+uz6'}I/fp)");

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Surveys']")),
      5000,
    );
    console.log("Login successful!");

    await driver.findElement(By.xpath("//button[text()='Surveys']")).click();

    const tableView1 = await driver.findElement(
      By.xpath("//button[contains(text(), 'Table View')]"),
    );
    await sleep(2000);

    await tableView1.click();
    await sleep(2000);

    console.log("Table view successful!");
    await sleep(2000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div[2]/div[2]/div/div[3]/div/div[1]/div[1]/div[2]/button",
        ),
      )
      .click();
    console.log("Clicked on select a patient");

    await sleep(2000);
    await driver.actions().sendKeys(Key.SPACE).perform();
    console.log("Viewed graph!");

    await sleep(2000);
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}
async function testCreateJournalEntry() {
  let driver = new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 15000,
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await driver.get("https://betterhealth.vercel.app/");

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@name='email']")),
      5000,
    );

    const emailInput = await driver.findElement(
      By.xpath("//input[@name='email']"),
    );
    await emailInput.sendKeys("badamowicz0@berkeley.edu");

    const passwordInput = await driver.findElement(
      By.xpath("//input[@name='password']"),
    );
    await passwordInput.sendKeys("gN5,X#F(5X=DG7L");

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();

    await driver.wait(until.urlContains("/dashboard"), 5000);
    console.log("Dashboard seen!");

    await driver
      .findElement(
        By.xpath("/html/body/div[1]/div[1]/div[2]/div/div[2]/div/ul/li[3]"),
      )
      .click();
    await driver.wait(until.urlContains("/journal"), 5000);
    console.log("Arrived to journals page!");
    await driver.wait(
      until.elementIsVisible(
        driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[1]/button")),
      ),
      5000,
    );
    console.log("Seen write an entry 1");
    await driver.wait(
      until.elementLocated(By.xpath("/html/body/div[1]/div[2]/div[1]/button")),
      5000,
    );
    console.log("Seen write an entry 2");

    await driver
      .findElement(By.xpath("/html/body/div[1]/div[2]/div[1]/button"))
      .click();
    console.log("Clicked on write entry");

    await driver
      .findElement(By.xpath("/html/body/div[5]/form/div[1]/div[1]/input"))
      .sendKeys("Journal number 48");
    console.log("Wrote title");

    await driver
      .findElement(By.xpath("/html/body/div[5]/form/div[1]/div[2]/textarea"))
      .sendKeys("ive not given up");

    console.log("put the message in the bag");
    await driver.findElement(By.xpath("//button[text()='Submit']")).click();
    console.log("submitted");

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div[2]/div[2]/div/div[1]/div[2]/div/div/div/div/button[4]/div[2]",
        ),
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div[2]/div[2]/div/div[1]/div[2]/div/div/div/div/button[8]/div[2]",
        ),
      )
      .click();
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

async function testSignup() {
  let driver = new Builder().forBrowser("chrome").build();

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await driver.get("https://betterhealth.vercel.app/");
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

    await driver.findElement(By.name("firstName")).sendKeys("Johnathan");
    await sleep(2000);
    await driver.findElement(By.name("lastName")).sendKeys("Doeathan");
    await sleep(2000);
    await driver
      .findElement(By.name("email"))
      .sendKeys("johndoe212452@example.com");
    await sleep(2000);
    await driver.findElement(By.name("password")).sendKeys("Password123523!");
    console.log("Filled out the form");
    await sleep(2000);

    await driver
      .findElement(By.xpath("//button[@type='submit' and text()='Submit']"))
      .click();
    console.log("Submitted the initial signup form");
    await sleep(2000);

    const ageButton = await driver.findElement(
      By.xpath("//button[@value='35-44']"),
    );
    await ageButton.click();
    console.log("Selected Age: 35-44");
    await sleep(2000);

    const genderButton = await driver.findElement(
      By.xpath("//button[@value='male']"),
    );
    await genderButton.click();
    console.log("Selected Gender: Male");
    await sleep(2000);

    const specialtyButton = await driver.findElement(
      By.xpath("//button[@value='addiction']"),
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
  } finally {
    await driver.quit();
  }
}

async function testCreateBilling() {
  let driver = new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 15000,
  });
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {

    await driver.get("https://betterhealth.vercel.app/");

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@name='email']")),
      5000,
    );

    const emailInput1 = await driver.findElement(
      By.xpath("//input[@name='email']"),
    );
    await emailInput1.sendKeys("tbrigginshawb@about.me");

    const passwordInput1 = await driver.findElement(
      By.xpath("//input[@name='password']"),
    );
    await passwordInput1.sendKeys("sN8+uz6'}I/fp)");

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();
    await driver
      .findElement(
        By.xpath("/html/body/div[1]/div[1]/div[2]/div/div[3]/ul/li/button"),
      )
      .click();
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/div[3]/a[1]"))
      .click();
    await driver
      .findElement(By.xpath("/html/body/div[1]/div[2]/div[1]/button"))
      .click();
    const patientDropdown = await driver.findElement(
      By.xpath("/html/body/div[5]/form/div[2]/button"),
    );
    await patientDropdown.click();
    await driver.findElement(By.xpath("//option[@value='1']")).click();
    await patientDropdown.click();

    console.log("Selected patient");
    await driver
      .findElement(By.xpath("/html/body/div[5]/form/div[3]/input"))
      .sendKeys("30");
    console.log("Entered price");

    await driver
      .findElement(By.xpath("/html/body/div[5]/form/div[4]/button"))
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[5]/form/div[4]/div/div/div/div/div/table/tbody/tr[5]/td[2]/button",
        ),
      )
      .click();
    await driver
      .findElement(By.xpath("/html/body/div[5]/form/div[4]/button"))
      .click();
    await driver.findElement(By.xpath("//button[text()='Submit']")).click();

    await driver
      .findElement(By.css("button[data-sidebar='menu-button']"))
      .click();

    const logoutButton = await driver.findElement(
      By.xpath(
        "//div[contains(text(), 'Log out') and contains(@class, 'cursor-default')]",
      ),
    );

    await logoutButton.click();
    console.log("Logout successful!");

    await driver.wait(until.urlIs("https://betterhealth.vercel.app/"), 5000);
    console.log("Redirected to homepage after logout.");

    // Patient log in to pay bills

    await driver.get("https://betterhealth.vercel.app/");

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@name='email']")),
      5000,
    );

    const emailInput = await driver.findElement(
      By.xpath("//input[@name='email']"),
    );
    await emailInput.sendKeys("badamowicz0@berkeley.edu");

    const passwordInput = await driver.findElement(
      By.xpath("//input[@name='password']"),
    );
    await passwordInput.sendKeys("gN5,X#F(5X=DG7L");

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();

    await driver
      .findElement(
        By.xpath("/html/body/div[1]/div[1]/div[2]/div/div[3]/ul/li/button"),
      )
      .click();
    console.log("Clicked on profile icon");
    await sleep(2000);
    await driver
      .findElement(By.xpath("/html/body/div[4]/div/div[3]/a[1]"))
      .click();
    console.log("clicked on billing");
    await sleep(2000);
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div[2]/div[2]/div/div/div[2]/div[1]/div/table/tbody/tr[1]/td[5]/button",
        ),
      )
      .click();
    console.log("Clicked on three dots");
    await sleep(2000);
    await driver.findElement(By.xpath("/html/body/div[4]/div")).click();
    console.log("Clicked on pay");
    await sleep(2000);
    await driver
      .findElement(By.xpath("/html/body/div[5]/div[2]/button[2]"))
      .click();
    console.log("Clicked on continue");
    await driver
      .findElement(By.xpath("/html/body/div[5]/div[2]/button[2]"))
      .click();
    await driver.navigate().refresh();
    await driver
      .findElement(By.css("button[data-sidebar='menu-button']"))
      .click();
    const logoutButton1 = await driver.findElement(
      By.xpath(
        "//div[contains(text(), 'Log out') and contains(@class, 'cursor-default')]",
      ),
    );

    await logoutButton1.click();
    console.log("Logout successful!");

    await driver.wait(until.urlIs("https://betterhealth.vercel.app/"), 5000);
    console.log("Redirected to homepage after logout.");

    // Therapist logs in to see outstanding bills and status
    await driver.get("https://betterhealth.vercel.app/");

    await driver.findElement(By.xpath("//button[text()='Log In']")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//input[@name='email']")),
      5000,
    );

    const emailInput2 = await driver.findElement(
      By.xpath("//input[@name='email']"),
    );
    await emailInput2.sendKeys("tbrigginshawb@about.me");

    const passwordInput2 = await driver.findElement(
      By.xpath("//input[@name='password']"),
    );
    await passwordInput2.sendKeys("sN8+uz6'}I/fp)");

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

testCreateBilling();
// testCreateJournalEntry();
// testShowSurveyGraph();
// testTakeAndShowSurveyData();


