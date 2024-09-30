const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');
test.describe.configure({ mode: 'parallel' });
let browser;
let page;

test.beforeAll(async () => {
    browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
    // await page.goto('/');
    await loginpage(page);
    
  });
  
test.afterAll(async () => {
    await browser.close();
});

// Step 1: Launch browser,  navigate to the URL & Login
async function loginpage(page) {
    // Visit the URL & Login
    await page.goto('/');
    await page.waitForTimeout(3000);
    await page.fill('#user-name', process.env.SAUCEDEMO_USERNAME); //standard_user
    await page.fill('#password', process.env.SAUCEDEMO_PASSWORD); //secret_sauce
    // await page.locator('[data-test="username"]').fill('standard_user');
    // await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.waitForTimeout(3000);
    // expect(page).toHaveScreenshot('login-page.png'); // Login Page Visual Testing
    // await page.waitForTimeout(3000);
    await page.click('#login-button');
    await page.waitForTimeout(3000);
}

// test('Test Case 1: Login', async () => {
//     // await page.goto('https://www.saucedemo.com/');
//     await page.waitForTimeout(3000);
//     await page.fill('#user-name', process.env.SAUCEDEMO_USERNAME); //standard_user
//     await page.fill('#password', process.env.SAUCEDEMO_PASSWORD); //secret_sauce
//     // await page.fill('#user-name', 'standard_user'); //standard_user
//     // await page.fill('#password', 'secret_sauce'); //secret_sauce
//     // const LoginPage = await page.screenshot();
//     await page.waitForTimeout(3000);
//     expect(page).toHaveScreenshot('login-page.png'); // Login Page Visual Testing
//     // await page.waitForTimeout(6000);
//     await page.click('#login-button');
//     await page.waitForTimeout(3000);
    
//     // Verify login success...
// });

// Step 1: Verify the sorting order displayed for Z-A on the “All Items” page.
test('Test Case 1: Filter Sorting Order Z-A', async () => {
    await page.locator('.product_sort_container').selectOption('za');
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedProductNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedProductNames); // Verify Z-A sorting
    await page.waitForTimeout(2000);
    expect(page).toHaveScreenshot('z-a_filtering.png', { threshold: 0.9 }); // Z-A Filtering Visual Testing
    await page.waitForTimeout(3000);
    // Continue with the rest of the steps...
});

// Step 2: Verify the price order (high-low) displayed on the “All Items” page.
test('Test Case 2: Filter Price Order High-Low', async () => {
    await page.locator('.product_sort_container').selectOption('hilo');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const cleanedPrices = prices.map(price => parseFloat(price.replace('$', ''))); // removed the $ sign only
    const sortedPrices = prices.map(p => parseFloat(p.replace('$', ''))).sort((a, b) => b - a);
    expect(cleanedPrices).toEqual(sortedPrices); // Verify High-Low price sorting
    await page.waitForTimeout(2000);
    expect(page).toHaveScreenshot('hilo_filtering.png', { threshold: 0.9 }); // Hilo Filtering Visual Testing
    await page.waitForTimeout(3000);
    // Continue with the rest of the steps...
});

// Step 3: Add multiple items to the card 
test('Test Case 3: Add Multiple Items to the cart', async () => {
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.waitForTimeout(3000);
    await page.locator('[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]').click();
    // Verify the item is added to the cart
    await page.locator('.shopping_cart_link').click();
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(2); // Verify that 2 items are in the cart
    await page.waitForTimeout(2000);
    expect(page).toHaveScreenshot('cart-page.png', { threshold: 0.9 }); // Cart Page Visual Testing
    await page.waitForTimeout(3000);    
    // Continue with the rest of the steps...
});

// Step 4: Validate Checkout Journey
test('Test Case 4: Validate Checkout Journey', async () => {
    await page.locator('.shopping_cart_link').click();
    const cartBadge = await page.locator('.cart_item').count();
    if (cartBadge === 0) {
        console.log('Cart is empty, adding products...'); 
        // Go to the product page
        await page.locator('#continue-shopping').click();     
        await page.waitForTimeout(3000); 
        // Add two products to the cart
        await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click(); // Add first item
        await page.waitForTimeout(3000);
        await page.locator('[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]').click();
        // Navigate back to the cart page
        await page.locator('.shopping_cart_link').click();
        await page.waitForTimeout(3000);
      } else {
        console.log('Cart has items, proceeding with checkout...');
      }
    await page.locator('.checkout_button').click();
    await page.waitForTimeout(3000);
    await page.locator('#first-name').fill('Tanvir');
    await page.locator('#last-name').fill('Sharif');
    await page.locator('#postal-code').fill('12345');
    await page.waitForTimeout(2000);
    await page.locator('#continue').click();
    const totalPrice = await page.locator('.summary_total_label').textContent();
    expect(totalPrice).toContain('$'); // Verify total price is displayed
    await page.waitForTimeout(2000);
    expect(page).toHaveScreenshot('checkout-page.png', { threshold: 0.9 }); // Checkout Page Visual Testing
    await page.waitForTimeout(3000);
    await page.locator('#finish').click();
    const successMessage = await page.locator('.complete-header').textContent();
    expect(successMessage).toBe('Thank you for your order!'); // Verify order completion
    await page.waitForTimeout(2000);
    expect(page).toHaveScreenshot('order-completion.png', { threshold: 0.9 }); // Order Completion Visual Testing
    await page.waitForTimeout(3000);
    await page.locator('#back-to-products').click();
    // await page.waitForTimeout(3000);
    await page.locator('#react-burger-menu-btn').click();
    await page.waitForTimeout(1000);
    await page.locator('#logout_sidebar_link').click();    
    // End the rest of the steps...
});
