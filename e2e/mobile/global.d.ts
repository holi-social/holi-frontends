import type { Browser } from 'webdriverio'

type PlatformType = 'android' | 'ios'
type TargetType = 'local' | 'browserstack'

declare global {
  declare let Appium: Browser
  declare let platform: PlatformType
  declare let target: TargetType
  declare let sessionHolder: { id?: string }
}
