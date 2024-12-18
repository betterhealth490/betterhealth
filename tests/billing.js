import { Builder, By, Key, until } from "selenium-webdriver";

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
  