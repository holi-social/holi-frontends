import { Platform } from 'react-native'

/**
 * To use this, you need to first call setupPlatformOSMock at the beginning of your test
 * describe('some test', () => {
 *   setupPlatformOSMock()
 *   ....
 * }
 *
 * After that you can simply call mockPlatformOS('android') to mock the Platform type
 */
type PlatformOSType = 'ios' | 'android' | 'macos' | 'windows' | 'web'

const originalOS = Platform.OS
const platformOSMock = jest.fn()

export const setupPlatformOSMock = () => {
  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', {
      get: platformOSMock,
    })
  })

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', {
      get: () => originalOS,
    })
  })
}

export const mockPlatformOS = (platform: PlatformOSType) => {
  platformOSMock.mockReturnValue(platform)
}
