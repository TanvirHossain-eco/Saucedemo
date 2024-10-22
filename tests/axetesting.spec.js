const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');
// Import AXE-core library for accessibility testing
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility testing demo using Playwright and Axe', () => {

  let browser;
  let page;

  // Set up the browser and page before all tests
  test.beforeAll(async () => {
    browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();

    // Navigate to the site and perform login
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', process.env.SAUCEDEMO_USERNAME); //standard_user
    await page.fill('#password', process.env.SAUCEDEMO_PASSWORD); //secret_sauce
    // await page.fill('#user-name', 'standard_user');
    // await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Wait for inventory page to load
    // await page.waitForURL('https://www.saucedemo.com/inventory.html');
  });

  // Close the browser after all tests are done
  test.afterAll(async () => {
    await browser.close();
  });

  // Test for accessibility on the products page
  test('Products Page Accessibility Scan', async () => {
    const axeScanResults1 = await new AxeBuilder({page})
    // .include('#react-burger-menu-btn')
    // .disableRules(['empty-heading', 'heading-order'])
    .analyze();

    // Attach the accessibility scan results
    test.info().attach('axe-scan-results', {
      body: JSON.stringify(axeScanResults1, null, 2),
      contentType: 'application/json'
    });

    // Assert no accessibility violations
    expect(axeScanResults1.violations).toEqual([]);
  });

  // Test for Z-A sorting and accessibility scan
  test('Filtering Z-A Accessibility Scan', async () => {
    // Select sorting option Z-A
    await page.locator('.product_sort_container').selectOption('za');
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedProductNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedProductNames); // Verify Z-A sorting

    // Perform AXE accessibility scan
    const axeScanResults2 = await new AxeBuilder({page})
    .analyze();

    // Attach the accessibility scan results
    test.info().attach('axe-scan-results-za', {
      body: JSON.stringify(axeScanResults2, null, 2),
      contentType: 'application/json'
    });

    // Assert no accessibility violations
    expect(axeScanResults2.violations).toEqual([]);
  });

  // Test for High-Low sorting and accessibility scan
  test('Filtering High-Low Accessibility Scan', async () => {
    // Select sorting option High-Low
    await page.locator('.product_sort_container').selectOption('hilo');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const cleanedPrices = prices.map(price => parseFloat(price.replace('$', '')));
    const sortedPrices = [...cleanedPrices].sort((a, b) => b - a);
    expect(cleanedPrices).toEqual(sortedPrices); // Verify High-Low sorting

    // Perform AXE accessibility scan
    const axeScanResults3 = await new AxeBuilder({page})
    .analyze();

    // Attach the accessibility scan results
    test.info().attach('axe-scan-results-hilo', {
      body: JSON.stringify(axeScanResults3, null, 2),
      contentType: 'application/json'
    });

    // Assert no accessibility violations
    expect(axeScanResults3.violations).toEqual([]);
  });

  // Add multiple items to the cart Accessibility Scan
  test('Add Multiple Items to the cart Accessibility Scan', async () => {
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.waitForTimeout(3000);
    await page.locator('[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]').click();
    // Verify the item is added to the cart
    await page.locator('.shopping_cart_link').click();
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(2); // Verify that 2 items are in the cart
    // await page.waitForTimeout(2000);
    // expect(page).toHaveScreenshot('cart-page.png', { maxDiffPercentage: 50 }); // Cart Page Visual Testing
    await page.waitForTimeout(3000);    
    // Continue with the rest of the steps...

    // Perform AXE accessibility scan
    const axeScanResults4 = await new AxeBuilder({page})
    .analyze();

    // Attach the accessibility scan results
    test.info().attach('axe-scan-results-cart', {
      body: JSON.stringify(axeScanResults4, null, 2),
      contentType: 'application/json'
    });

    // Assert no accessibility violations
    expect(axeScanResults4.violations).toEqual([]);
  });
  
  // Check out Journey Step 1 Page Accessibility Scan
  test('Checkout Journey Step 1 Page Accessibility Scan', async () => {
    await page.locator('.shopping_cart_link').click();
    const cartBadge = await page.locator('.cart_item').count();
    if (cartBadge === 0) {
        console.log('Cart is empty, adding products...'); 
        // Go to the product page
        await page.locator('#continue-shopping').click();     
        // await page.waitForTimeout(3000); 
        // Add two products to the cart
        await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click(); // Add first item
        // await page.waitForTimeout(3000);
        await page.locator('[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]').click();
        // Navigate back to the cart page
        await page.locator('.shopping_cart_link').click();
        await page.waitForTimeout(3000);
      } else {
        console.log('Cart has items, proceeding with checkout...');
      }
    await page.locator('.checkout_button').click();
    // await page.waitForTimeout(3000);
    await page.locator('#first-name').fill('Tanvir');
    await page.locator('#last-name').fill('Sharif');
    await page.locator('#postal-code').fill('12345');
    
    // Perform AXE accessibility scan
    const axeScanResults5 = await new AxeBuilder({page})
    .analyze();

    // Attach the accessibility scan results    
    test.info().attach('axe-scan-results-checkout', {
      body: JSON.stringify(axeScanResults5, null, 2),
      contentType: 'application/json'
    });

    // Assert no accessibility violations
    expect(axeScanResults5.violations).toEqual([]); 

  });

  // Check out Journey Step 2 Page Accessibility Scan
  test('Checkout Journey Step 2 Page Accessibility Scan', async () => {
    await page.locator('.shopping_cart_link').click();
    const cartBadge = await page.locator('.cart_item').count();
    if (cartBadge === 0) {
        console.log('Cart is empty, adding products...'); 
        // Go to the product page
        await page.locator('#continue-shopping').click();     
        // await page.waitForTimeout(3000); 
        // Add two products to the cart
        await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click(); // Add first item
        // await page.waitForTimeout(3000);
        await page.locator('[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]').click();
        // Navigate back to the cart page
        await page.locator('.shopping_cart_link').click();
        await page.waitForTimeout(3000);
      } else {
        console.log('Cart has items, proceeding with checkout...');
      }
    await page.locator('.checkout_button').click();
    // await page.waitForTimeout(3000);
    await page.locator('#first-name').fill('Tanvir');
    await page.locator('#last-name').fill('Sharif');
    await page.locator('#postal-code').fill('12345');
    await page.locator('#continue').click();
    const totalPrice = await page.locator('.summary_total_label').textContent();
    expect(totalPrice).toContain('$'); // Verify total price is displayed
    // await page.waitForTimeout(2000);
    // expect(page).toHaveScreenshot('checkout-page.png', { maxDiffPercentage: 50 }); // Checkout Page Visual Testing
    await page.waitForTimeout(3000);

    // Perform AXE accessibility scan
    const axeScanResults6 = await new AxeBuilder({page})
    .analyze(); 

    // Attach the accessibility scan results    
    test.info().attach('axe-scan-results-summary', {
      body: JSON.stringify(axeScanResults6, null, 2),
      contentType: 'application/json'
    });

    // Assert no accessibility violations
    expect(axeScanResults6.violations).toEqual([]);

  });

  // Check out Journey Final Page Accessibility Scan
  test('Checkout Journey Final Page Accessibility Scan', async () => {
    await page.locator('.shopping_cart_link').click();
    const cartBadge = await page.locator('.cart_item').count();
    if (cartBadge === 0) {
        console.log('Cart is empty, adding products...'); 
        // Go to the product page
        await page.locator('#continue-shopping').click();     
        // await page.waitForTimeout(3000); 
        // Add two products to the cart
        await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click(); // Add first item
        // await page.waitForTimeout(3000);
        await page.locator('[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]').click();
        // Navigate back to the cart page
        await page.locator('.shopping_cart_link').click();
        await page.waitForTimeout(3000);
      } else {
        console.log('Cart has items, proceeding with checkout...');
      }
    await page.locator('.checkout_button').click();
    // await page.waitForTimeout(3000);
    await page.locator('#first-name').fill('Tanvir');
    await page.locator('#last-name').fill('Sharif');
    await page.locator('#postal-code').fill('12345');
    await page.locator('#continue').click();
    const totalPrice = await page.locator('.summary_total_label').textContent();
    expect(totalPrice).toContain('$'); // Verify total price is displayed
    // await page.waitForTimeout(2000);
    // expect(page).toHaveScreenshot('checkout-page.png', { maxDiffPercentage: 50 }); // Checkout Page Visual Testing
    await page.waitForTimeout(3000);
    await page.locator('#finish').click();
    const successMessage = await page.locator('.complete-header').textContent();
    expect(successMessage).toBe('Thank you for your order!'); // Verify order completion
    // await page.waitForTimeout(2000);
    // expect(page).toHaveScreenshot('order-completion.png', { maxDiffPercentage: 50 }); // Order Completion Visual Testing
    await page.waitForTimeout(3000);

    // Perform AXE accessibility scan
    const axeScanResults7 = await new AxeBuilder({page})
    .analyze();

    // Attach the accessibility scan results
    test.info().attach('axe-scan-results-completion', {
      body: JSON.stringify(axeScanResults7, null, 2),
      contentType: 'application/json'
    });

    // Assert no accessibility violations
    expect(axeScanResults7.violations).toEqual([]);

  });

  // Login Page Accessibility Scan
  test('Login Page Accessibility Scan', async () => {
    await page.locator('#react-burger-menu-btn').click();
    await page.waitForTimeout(3000);
    await page.locator('#logout_sidebar_link').click();    
    // End the rest of the steps...

    // Perform AXE accessibility scan
    const axeScanResults8 = await new AxeBuilder({page})
    .analyze(); 

    // Attach the accessibility scan results
    test.info().attach('axe-scan-results-login', {
      body: JSON.stringify(axeScanResults8, null, 2),
      contentType: 'application/json'
    });

    // Assert no accessibility violations
    expect(axeScanResults8.violations).toEqual([]);

  });
});
