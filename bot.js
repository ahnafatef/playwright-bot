const { chromium } = require('playwright');
const path = require('path');
const { getFormData, logResult } = require('./sheets');
const { downloadFile } = require('./drive');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const data = await getFormData();
    const imagePath = path.resolve(__dirname, 'images', 'upload.jpg');
    await downloadFile(imagePath);

    await page.goto('https://demoqa.com/automation-practice-form', { waitUntil: 'domcontentloaded' });

    await page.evaluate(() => {
      document.querySelector('#fixedban')?.remove();
      document.querySelector('footer')?.remove();
    });

    const genderSelector = data.gender === 'M' ? 'label[for="gender-radio-1"]' : 'label[for=gender-radio-2]';
    await page.fill('#firstName', data.firstName);
    await page.fill('#lastName', data.lastName);
    await page.fill('#userEmail', data.email);
    await page.click(genderSelector);
    await page.fill('#userNumber', data.phone);
    await page.setInputFiles('#uploadPicture', imagePath);

    await page.click('#submit');
    await page.waitForSelector('#example-modal-sizes-title-lg');

    await logResult(true, 'Form submitted successfully');
    console.log('✅ Success!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err);
    await logResult(false, err.message);
  } finally {
    await browser.close();
  }
})();
