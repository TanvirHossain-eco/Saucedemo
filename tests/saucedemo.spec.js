const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');
test.describe.configure({ mode: 'serial' });
let browser;
let page;

test.beforeAll(async () => {
    browser = await require('playwright').chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/');
    
  });
  
test.afterAll(async () => {
    await browser.close();
});

// Step 1: Launch browser,  navigate to the URL & Login
test('Test Case 1: Login', async () => {
    // await page.goto('https://www.saucedemo.com/');
    await page.waitForTimeout(3000);
    await page.fill('#user-name', process.env.SAUCEDEMO_USERNAME); //standard_user
    await page.fill('#password', process.env.SAUCEDEMO_PASSWORD); //secret_sauce
    // await page.fill('#user-name', 'standard_user'); //standard_user
    // await page.fill('#password', 'secret_sauce'); //secret_sauce
    // const LoginPage = await page.screenshot();
    await page.waitForTimeout(3000);
    expect(page).toHaveScreenshot('login-page.png'); // Login Page Visual Testing
    await page.click('#login-button');
    await page.waitForTimeout(3000);
    
    // Verify login success...
});

// Step 2: Verify the sorting order displayed for Z-A on the “All Items” page.
test('Test Case 2: Filter Sorting Order Z-A', async () => {
    await page.locator('.product_sort_container').selectOption('za');
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedProductNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedProductNames); // Verify Z-A sorting
    expect(page).toHaveScreenshot('z-a_filtering.png'); // Z-A Filtering Visual Testing
    await page.waitForTimeout(3000);
    // Continue with the rest of the steps...
});

// Step 3: Verify the price order (high-low) displayed on the “All Items” page.
test('Test Case 3: Filter Price Order High-Low', async () => {
    await page.locator('.product_sort_container').selectOption('hilo');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const cleanedPrices = prices.map(price => parseFloat(price.replace('$', ''))); // removed the $ sign only
    const sortedPrices = prices.map(p => parseFloat(p.replace('$', ''))).sort((a, b) => b - a);
    expect(cleanedPrices).toEqual(sortedPrices); // Verify High-Low price sorting
    expect(page).toHaveScreenshot('hilo_filtering.png'); // Hilo Filtering Visual Testing
    await page.waitForTimeout(3000);
    // Continue with the rest of the steps...
});

// Step 4: Add multiple items to the card 
test('Test Case 4: Add Multiple Items to the cart', async () => {
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.waitForTimeout(3000);
    await page.locator('[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]').click();
    // Verify the item is added to the cart
    await page.locator('.shopping_cart_link').click();
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(2); // Verify that 2 items are in the cart
    expect(page).toHaveScreenshot('cart-page.png'); // Cart Page Visual Testing
    await page.waitForTimeout(3000);    
    // Continue with the rest of the steps...
});

// Step 5: Validate Checkout Journey
test('Test Case 5: Validate Checkout Journey', async () => {
    await page.locator('.checkout_button').click();
    await page.waitForTimeout(3000);
    await page.locator('#first-name').fill('Tanvir');
    await page.locator('#last-name').fill('Sharif');
    await page.locator('#postal-code').fill('12345');
    await page.waitForTimeout(2000);
    await page.locator('#continue').click();
    const totalPrice = await page.locator('.summary_total_label').textContent();
    expect(totalPrice).toContain('$'); // Verify total price is displayed
    expect(page).toHaveScreenshot('checkout-page.png'); // Checkout Page Visual Testing
    await page.waitForTimeout(3000);
    await page.locator('#finish').click();
    const successMessage = await page.locator('.complete-header').textContent();
    expect(successMessage).toBe('Thank you for your order!'); // Verify order completion
    expect(page).toHaveScreenshot('order-completion.png'); // Order Completion Visual Testing
    await page.waitForTimeout(3000);
    await page.locator('#back-to-products').click();
    await page.waitForTimeout(3000);
    // await page.locator('#react-burger-menu-btn').click();
    // await page.waitForTimeout(3000);
    // await page.locator('#logout_sidebar_link').click();
    // End the rest of the steps...
});

// test('Test case 6: Visual comparison of the products page', async () => {
//     await page.goto('/inventory.html');
//     await page.waitForTimeout(3000);
//     expect(await page.screenshot()).toMatchSnapshot('products-page.png', { threshold: 0.1 }); // Compare with baseline
//     await page.waitForTimeout(3000);
//     // Continue with the rest of the steps...
// });