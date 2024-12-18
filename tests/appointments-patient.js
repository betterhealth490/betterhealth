import { By, Key, until } from "selenium-webdriver";

export async function bookAppointment(driver) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await driver.findElement(By.xpath("//a[@href='/appointments']")).click();
    console.log("Navigated to Appointments page");
    await sleep(2000);

    await driver.findElement(By.xpath("//button[@aria-label='Friday, December 27th, 2024']")).click();
    console.log("Selected day: 27");
    await sleep(2000);

    const therapistDropdown = await driver.findElement(
      By.xpath("//select[contains(@class, 'w-full')][1]")
    );
    await therapistDropdown.click();
    await sleep(1000);
    await driver.findElement(By.xpath("//option[@value='12']")).click();
    console.log("Selected Therapist: Tate Brigginshaw");
    await sleep(2000);

    try {

        const timeDropdown = await driver.wait(
        until.elementLocated(By.xpath("//select[contains(@class, 'w-full')]")),
        5000 
        );
    
        await timeDropdown.click();

        const option = await driver.findElement(By.xpath("//option[@value='16:30']"));
        await option.click();
    
        console.log("Selected Time Slot: 17:30");
        await sleep(2000); 
    } catch (error) {
        console.error("Failed to select time slot:", error);
    }
    const notesBox = await driver.findElement(
      By.xpath("//textarea[@placeholder='Enter notes...']")
    );
    await notesBox.sendKeys("Need Help");
    console.log("Entered Notes: Need Help");
    await sleep(2000);

    await driver.findElement(By.xpath("//button[text()='Submit']")).click();
    console.log("Submitted the appointment");
    await sleep(3000);

    await driver.findElement(By.xpath("//button[@aria-label='Friday, December 28th, 2024']")).click();
    console.log("Selected day: 28");
    await sleep(2000);
  
      const therapistDropdown2 = await driver.findElement(
        By.xpath("//select[contains(@class, 'w-full')][1]")
      );
      await therapistDropdown.click();
      await sleep(1000);
      await driver.findElement(By.xpath("//option[@value='12']")).click();
      console.log("Selected Therapist: Tate Brigginshaw");
      await sleep(2000);
  
      try {
          const timeDropdown = await driver.wait(
          until.elementLocated(By.xpath("//select[contains(@class, 'w-full')]")),
          5000 
          );

          await timeDropdown.click();

          const option = await driver.findElement(By.xpath("//option[@value='17:30']"));
          await option.click();
      
          console.log("Selected Time Slot: 17:30");
          await sleep(2000);
      } catch (error) {
          console.error("Failed to select time slot:", error);
      }
  
      const notesBox2 = await driver.findElement(
        By.xpath("//textarea[@placeholder='Enter notes...']")
      );
      await notesBox.sendKeys("Need Help Please");
      console.log("Entered Notes: Need Help Please");
      await sleep(2000);
  
      await driver.findElement(By.xpath("//button[text()='Submit']")).click();
      console.log("Submitted the appointment");
      await sleep(3000);

    const successMessage = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'successfully')]")),
      5000
    );
    if (successMessage) {
      console.log("Appointment booked successfully!");
    } else {
      console.log("Failed to confirm appointment submission.");
    }
  } catch (error) {
    console.error("Booking appointment failed:", error);
  }
}
