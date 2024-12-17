import { Builder, By, Key, until } from "selenium-webdriver";
import assert from "assert";


async function logIn () {
  let driver = new Builder().forBrowser('chrome').build();
 
  await driver.get("https://betterhealth.vercel.app/")
  await driver.findElement(By.css(".border-primary-foreground")).click()
  const element = await driver.findElement(By.xpath("//input[@name='email']"));
  await element.click();
  await element.sendKeys("badamowicz0@berkeley.edu");
  await driver.findElement(By.id(":r1:-form-item")).sendKeys("gN5,X#F(5X=DG7L")
  await driver.findElement(By.css(".text-primary-foreground")).click()
  await driver.findElement(By.css(".h-7")).click()
  {
    const element = await driver.findElement(By.className("sr-only"))
    await element.click()
  }
  {
    const element = await driver.findElement(By.id("radix-:r11"))
    await element.click()
  }
  {
    const element = await driver.findElement(By.css(".group\\/menu-item:nth-child(4) span"))
    await element.click()
  }
  {
    const element = await driver.findElement(By.css("body"))
    await element.click()
  }
  await driver.findElement(By.css("html")).click()
  await driver.findElement(By.css(".relative:nth-child(5)")).click()
}

logIn();