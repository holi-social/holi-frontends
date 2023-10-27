import { isChatNotification } from '@holi/mobile/notifications/chatNotifications'

let mockGetCurrentRoute: jest.Mock | undefined
jest.mock('@holi/mobile/navigation/NavigationProvider', () => ({
  navigationRef: { current: { getCurrentRoute: () => mockGetCurrentRoute?.() } },
}))

describe('isChatNotification', () => {
  it('should treat chat notifications as default', () => {
    expect(isChatNotification(undefined)).toBeTruthy()
  })

  it('should recognize chat notification if notification type is unknown', () => {
    expect(isChatNotification({})).toBeTruthy()
  })

  it('should recognize non-chat notification', () => {
    expect(isChatNotification({ notification_type: 'FOOBAR' })).toBeFalsy()
  })
})
