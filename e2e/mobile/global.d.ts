import type { Browser } from 'webdriverio'

declare let Appium: Browser<'async'>
declare let platform: 'android' | 'ios'
declare let target: 'local' | 'browserstack'
