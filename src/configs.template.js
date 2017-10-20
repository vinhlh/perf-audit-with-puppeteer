const configs = {
  urls: [
    'https://www.zalora.com.ph/women/',
    'https://www.zalora.com.ph/women/clothing/dresses/special-price/'
  ],
  ravenDsn: 'https://aaa:bbbb@sentry.io/35',
  slack: {
    hook:
      'https://hooks.slack.com/services/xxxx',
    options: {
      channel: '#demeter-room',
      icon_url: 'https://static-ph.zacdn.com/images/favicon.png',
      username: 'Zalora Bot'
    }
  }
}

module.exports = configs
