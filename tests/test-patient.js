import { Builder } from "selenium-webdriver";
import { login } from "./log-in-patients.js";
import { logout } from "./log-out.js";
import { bookAppointment } from "./appointments-patient.js";

async function testpatient() {
  const driver = new Builder().forBrowser("chrome").build();

  try {
    const email = "badamowicz0@berkeley.edu";
    const password = "gN5,X#F(5X=DG7L";

    await login(driver, email, password);

    await bookAppointment(driver);

    await logout(driver);
  } catch (error) {
    console.error("Test failed due to error:", error);
  } finally {
    await driver.quit();
  }
}

testpatient();