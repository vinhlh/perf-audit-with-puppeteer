const puppeteer = require('puppeteer')
const validators = require('./validators')
const configs = require('./configs')
const alert = require('./slack')
const Raven = require('raven')

const run = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const errorCounts = await Promise.all(
    configs.urls.map(async url => {
      const page = await browser.newPage()
      await page.goto(url)

      const results = await Promise.all(
        validators
          .filter(([match]) => match(url))
          .map(([_, validator]) => validator)
          .map(validator => page.evaluate(validator))
      )

      const errors = results.filter(result => !!result)

      await Promise.all(
        errors.map(msg =>
          alert({
            ...msg,
            title: url,
            title_link: url
          })
        )
      )

      return [url, errors.length]
    })
  )

  await browser.close()

  return errorCounts
}

Raven.config(configs.ravenDsn).install()

run()
  .then(errorCounts => {
    console.log(`Run successfully with errorCounts = [${errorCounts}]`)
    Raven.captureMessage('Run successfully', {
      level: 'info',
      extra: { errorCounts }
    })
    setTimeout(() => process.exit(), 3000)
  })
  .catch(exception => {
    Raven.captureException(exception)
    // HACK: wait for sentry reporting
    setTimeout(() => process.exit(), 3000)
  })
