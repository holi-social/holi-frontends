const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure')

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS)

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins()

exports.config = {
  name: 'web',
  tests: './**/*.test.js',
  output: './output',
  helpers: {
    Playwright: {
      url: process.env.BASE_URL || 'http://localhost:3000',
      show: false, // headless
      browser: 'chromium',
    },
    SelectorHelper: {
      require: './helpers/css-selector.js',
    },
    AccessibilityHelper: {
      require: './helpers/axe-playwright.js',
    },
  },
  include: {
    I: './steps_file.js',
  },
  multiple: {
    crossbrowser: {
      // browsers: [{ browser: 'firefox' }, { browser: 'webkit' }, { browser: 'chromium' }],
      browsers: [{ browser: 'chromium' }],
    },
  },
  bootstrap: null,
  mocha: {},
}
