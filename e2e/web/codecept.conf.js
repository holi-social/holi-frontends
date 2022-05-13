const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure')

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS)

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins()

exports.config = {
  tests: './*.js',
  output: './output',
  helpers: {
    Playwright: {
      url: process.env.BASE_URL || 'http://localhost:3000',
      show: true,
      browser: 'chromium',
    },
  },
  multiple: {
    crossbrowser: {
      browsers: [{ browser: 'firefox' }, { browser: 'webkit' }, { browser: 'chromium' }],
    },
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'web',
}
