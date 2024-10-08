Saucedemo Website Automation Readme
====================================
Prerequisites:
IDE (VS Code)
Git Bash Installation
Node Js Installation
After installation of Node JS open the command prompt 
check node & npm version
To check Node version = node -v
To check NPM version = npm -v
Installation of Playwright
1. Create a new folder on any Drive or location & Open in VS Code
example of location E:\QA Automation\Playwright\
New Folder name = saucedemo
2. Go to Terminal and run the command - npm init playwright@latest
Select Option - JavaScript
Tests
True

----- Complete Installation ----

Suggestion of some Basic Commands
==================================
Inside that Directory, you can run several commands:

Run the end-to-end tests.
npx playwright test 

Run the tests only on Desktop Chrome.
npx playwright test --project=chromium

Runs the test in a specific file.
npx playwright test example

Runs the tests in debug mode.
npx playwright test --debug

Auto generate tests with codegen
npx playwright codegen 

Check playwright version
npm playwright -v

Check playwright command options (if required)
npx playwright --help

Some changes on the configuration file
======================================
3. Add some changes on playwright.config.js configuration file

3.1 /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },

3.2 If you want to run the test in serial mode then need to change this on configuration file
/* Run tests in files in parallel */
  fullyParallel: true, -> Need to change it to false for running the test in serial mode

3.3 If you want to generate multiple in build or third party report for test then need to change this on configuration file
reporter: [["html"], ["allure-playwright"]],

3.4 To add the base url need to change this on configuration
use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    headless: true,
    baseURL: 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

----- Complete all the necessary Changes ----------------

Run the test
==============

4. Create a new file under the tests director & name the file -> saucedemo.spec.js
All automation source codes will be written on this file.

5. Before running the test must provide the login credentials command on the terminal
$env:SAUCEDEMO_USERNAME = "standard_user"
$env:SAUCEDEMO_PASSWORD = "secret_sauce"

6. Run the headless test by the below command on the terminal
npx playwright test
or
npx playwright test ./tests/saucedemo.spec.js
or
npx playwright test ./tests/saucedemo.spec.js --project=chromium


7. Run the headed test by the below command on the terminal
npx playwright test --headed
or
npx playwright test ./tests/saucedemo.spec.js --headed
or
npx playwright test ./tests/saucedemo.spec.js --project=chromium --headed

8. Run the test with debug mode
npx playwright test --debug 
or
npx playwright test ./tests/saucedemo.spec.js --debug
or
npx playwright test ./tests/saucedemo.spec.js --project=chromium --debug

9. Command for generating html report
npx playwright show-report

Git Deployment Steps
=====================
1. For the first time Only - Initialize a Git repository
git init

2. Add all the updated files
git add .

3. Check all the updated files are added or not
git status

4. Commit your changes with a message
git commit -m "Give Your Message Here"

4. Connect Your Local Repository to the Remote Repository 
git remote add origin <give-your-repository-url-here>

5. Push Your Code to GitHub
git push -u origin master

Headed Automation: 
https://app.screencast.com/C8e2NfgYbNTlc

Headless Automation:
https://app.screencast.com/Dt1nH9UbiDVnI
