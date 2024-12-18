import { Builder } from "selenium-webdriver";
import { logintherapist } from "./log-in-therapist.js";
import { logout } from "./log-out.js";
import { checkappointment } from "./appointments-therapist.js";
import { checkBilling } from "./billing-therapist.js";

async function testtherapist() {
  const driver = new Builder().forBrowser("chrome").build();

  try {
    const email = "tbrigginshawb@about.me";
    const password = "sN8+uz6'}I/fp)";

    await logintherapist(driver, email, password);

    await checkappointment(driver);


    await logout(driver);
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

testtherapist();
