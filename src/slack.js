const request = require('request-promise')
const configs = require('./configs')

const alert = async ({ fields, ...rest }) => {
  const { slack: { hook, options } } = configs
  const payload = {
    ...options,
    attachments: [
      {
        ...rest,
        color: 'warning',
        footer: 'PerfAudit',
        ts: (+new Date())/1000,
        mrkdwn_in: ['text', 'pretext'],
        fields: fields
          ? Object.keys(fields).map(title => ({
              title,
              value: fields[title],
              short: `${fields[title]}`.length < 25
            }))
          : []
      }
    ]
  }

  await request.post(
    hook,
    {
      form: {
        payload: JSON.stringify(payload)
      }
    },
    (err, resp) => err && console.warn(err)
  )
}

module.exports = alert
