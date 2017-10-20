const request = require('request')
const configs = require('./configs')

const alert = ({ fields, ...rest }) => {
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

  request.post(
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
