const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url"); // Required for converting paths to URLs

const testsFolder = path.resolve(__dirname, "tests");

async function runAllTests() {
  try {
    const files = fs.readdirSync(testsFolder);

    for (const file of files) {
      const filePath = path.join(testsFolder, file);
      if (file.endsWith(".js")) {
        console.log(`Running test: ${file}`);
        const fileURL = pathToFileURL(filePath).href; // Convert path to file:// URL
        await import(fileURL); // Dynamically import the test file
      }
    }

    console.log("All tests completed.");
  } catch (error) {
    console.error("Error running tests:", error);
    process.exit(1); // Exit with non-zero code on failure
  }
}

runAllTests();
