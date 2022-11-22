'use strict'

const https = require('https')

const markBrowserStack = (sessionId, status, reason = '') => {
  const options = {
    hostname: 'api-cloud.browserstack.com',
    port: 443,
    path: `/app-automate/sessions/${sessionId}.json`,
    method: 'PUT',
    auth: `${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const req = https.request(options, (res) => {
    if (res.statusCode != 200) {
      console.log('statusCode:', res.statusCode)
      console.log('headers:', res.headers)

      res.on('data', (d) => {
        process.stdout.write(d)
      })
    }
  })

  req.on('error', (e) => {
    console.error(e)
  })
  req.end(
    JSON.stringify({
      status: status,
      reason: reason,
    })
  )
}

class BrowserstackReporter {
  onRunStart() {
    global.sessionHolder = {}
  }

  onTestCaseResult(test, testCaseResult) {
    if (process.env.APPIUM_TARGET === 'browserstack') {
      if (testCaseResult.status === 'failed') {
        console.log('Marking test failed in Browserstack')
        markBrowserStack(global.sessionHolder.id, testCaseResult.status, String(testCaseResult.failureMessages))
      } else {
        console.log('Marking test passed in Browserstack')
        markBrowserStack(global.sessionHolder.id, testCaseResult.status)
      }
    }
  }
}

module.exports = BrowserstackReporter
