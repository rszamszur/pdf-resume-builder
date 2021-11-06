#!/usr/bin/env node
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: process.cwd()});

  await page.goto('http://localhost:7777');
  console.log ('navigated to localhost');

  await page.waitForSelector('input[type=file]');
  await page.waitFor(1000);

  const elementHandle = await page.$("input[type=file]");
  await elementHandle.uploadFile(process.cwd() + '/resume.json');
  await elementHandle.evaluate(upload => upload.dispatchEvent(new Event('change', { bubbles: true })));

  await page.waitFor(1000);
  const button = (await page.$x("//button[contains(., 'Save PDF')]"))[0];
  await button.click();
  await page.waitFor(1000);
  await browser.close();
})();
