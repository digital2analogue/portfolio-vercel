import { test, expect } from '@playwright/test'

test.describe('Portfolio Pages', () => {
  test('home page loads and matches snapshot', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.*/)
    await expect(page).toHaveScreenshot('home.png')
  })

  test('work page loads and matches snapshot', async ({ page }) => {
    await page.goto('/work')
    await expect(page).toHaveScreenshot('work.png')
  })

  test('about page loads and matches snapshot', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveScreenshot('about.png')
  })

  test('contact page loads and matches snapshot', async ({ page }) => {
    await page.goto('/contact')
    await expect(page).toHaveScreenshot('contact.png')
  })

  test('tokens page loads and matches snapshot', async ({ page }) => {
    await page.goto('/tokens')
    await expect(page).toHaveScreenshot('tokens.png')
  })
})
