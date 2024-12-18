import { Builder } from "selenium-webdriver";
import { logintherapist } from "./log-in-therapist.js";
import { logout } from "./log-out.js";
import { checkappointment } from "./appointments-therapist.js";
import { checkBilling } from "./billing-therapist.js";
import { signupTherapist } from "./sign-up-therapist.js";
import { Options } from "selenium-webdriver/chrome.js";

async function testtherapist() {
  const options = new Options();
  options.addArguments("--headless"); // Run Chrome without GUI
  options.addArguments("--disable-gpu"); // Disable GPU for CI
  options.addArguments("--no-sandbox"); // Required for CI environments
  options.addArguments("--disable-dev-shm-usage"); // Fix shared memory issues
  options.addArguments("--remote-debugging-port=9222"); // Avoid DevTools issues
  const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    const email = "tbrigginshawb@about.me";
    const password = "sN8+uz6'}I/fp)";

    await logintherapist(driver, email, password);

    await checkappointment(driver);

    await logout(driver);

    await signupTherapist(driver);

    await logout(driver);
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

testtherapist();
