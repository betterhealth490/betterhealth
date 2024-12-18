import { Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";
import { login } from "./log-in-patients.js";
import { logout } from "./log-out.js";
import { bookAppointment } from "./appointments-patient.js";
import { signupPatient } from "./sign-up-patient.js";

async function testpatient() {
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
    const email = "badamowicz0@berkeley.edu";
    const password = "gN5,X#F(5X=DG7L";

    await login(driver, email, password);

    await bookAppointment(driver);

    await logout(driver);

    await signupPatient(driver);

    await logout(driver);
  } catch (error) {
    console.error("Test failed due to error:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

testpatient();
