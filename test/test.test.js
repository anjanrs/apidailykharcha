const puppeteer = require("puppeteer");

test("Adds to numbers", () => {
  const sum = 1 + 2;
  expect(sum).toEqual(3);
});

test("We can lunch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
});
