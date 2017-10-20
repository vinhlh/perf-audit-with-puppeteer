const puppeteer = require('puppeteer')
const validators = require('./validators')
const configs = require('./configs')
const alert = require('./slack')
;(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  await Promise.all(
    configs.urls.map(async function(url) {
      const page = await browser.newPage()
      await page.goto(url)

      const results = await Promise.all(
        validators
          .filter(([match]) => match(url))
          .map(([_, validator]) => validator)
          .map(validator => page.evaluate(validator))
      )

      results.filter(result => !!result).forEach(msg =>
        alert({
          ...msg,
          title: url,
          title_link: url
        })
      )

      return true
    })
  )

  await browser.close()
})()
