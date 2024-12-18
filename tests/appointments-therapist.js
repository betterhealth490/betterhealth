import { By, until } from "selenium-webdriver";

export async function checkappointment(driver) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await driver.findElement(By.xpath("//a[@href='/appointments']")).click();
    console.log("Navigated to Appointments page");
    await sleep(2000);

    const pendingAppointment = await driver.findElement(
      By.xpath("//*[contains(text(), 'pending')]"),
    );
    if (pendingAppointment) {
      console.log("Found a pending appointment");

      const confirmButton = await driver.findElement(
        By.xpath("//button[contains(@class, 'bg-green-500')]"),
      );
      await confirmButton.click();
      console.log("Clicked 'Confirm' button for the appointment");
      await sleep(2000);

      const updatedStatus = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'confirmed')]")),
        5000,
      );
      if (updatedStatus) {
        console.log("Appointment confirmed successfully");
      }
    } else {
      console.log("No pending appointments found to confirm");
    }

    const cancelButton = await driver.findElement(
      By.xpath("//button[contains(@class, 'bg-red-500')]"),
    );
    if (cancelButton) {
      console.log("Found an appointment to cancel");
      await cancelButton.click();
      console.log("Clicked 'Cancel' button for the appointment");
      await sleep(2000);

      const updatedStatus = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'cancelled')]")),
        5000,
      );
      if (updatedStatus) {
        console.log("Appointment cancelled successfully");
      }
    } else {
      console.log("No pending appointments found to cancel");
    }
  } catch (error) {
    console.error("Error managing appointments:", error);
  }
}
