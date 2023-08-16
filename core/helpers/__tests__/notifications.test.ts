import { PermissionStatus } from 'expo-modules-core'
import { Notification, NotificationHandler, NotificationRequestInput } from 'expo-notifications'

import { initNotifications } from '@holi/core/helpers/notifications'

let mockIsDevice: jest.Mock | undefined

jest.mock('@holi/core/helpers/isDevice', () => ({
  isDevice: () => mockIsDevice?.() ?? true, // default = true
}))

let mockGetPermissionsAsync: jest.Mock | undefined
let mockRequestPermissionsAsync: jest.Mock | undefined
let mockSetNotificationHandler: jest.Mock | undefined
let mockRegisterTaskAsync: jest.Mock | undefined
let mockScheduleNotificationAsync: jest.Mock | undefined

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: () => mockGetPermissionsAsync?.(),
  requestPermissionsAsync: () => mockRequestPermissionsAsync?.(),
  setNotificationHandler: (handler: NotificationHandler) => mockSetNotificationHandler?.(handler),
  registerTaskAsync: () => mockRegisterTaskAsync?.(),
  scheduleNotificationAsync: (input: NotificationRequestInput) => mockScheduleNotificationAsync?.(input),
}))

function setNotificationMocks(
  getStatus: PermissionStatus = PermissionStatus.UNDETERMINED,
  requestStatus: PermissionStatus = PermissionStatus.GRANTED
) {
  mockGetPermissionsAsync = jest.fn().mockReturnValue({ status: getStatus })
  mockRequestPermissionsAsync = jest.fn().mockReturnValue({ status: requestStatus })
  mockSetNotificationHandler = jest.fn()
  mockRegisterTaskAsync = jest.fn()
  mockScheduleNotificationAsync = jest.fn()
}

describe('initNotifications', () => {
  it('should request permissions and set foreground and background handlers', async () => {
    setNotificationMocks()

    await initNotifications()

    expect(mockGetPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(1)
    expect(mockRegisterTaskAsync).toHaveBeenCalledTimes(1)
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
  })

  it('should not do anything in simulator', async () => {
    mockIsDevice = jest.fn().mockReturnValue(false)

    setNotificationMocks()

    await initNotifications()

    expect(mockGetPermissionsAsync).toHaveBeenCalledTimes(0)
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(0)
    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(0)
    expect(mockRegisterTaskAsync).toHaveBeenCalledTimes(0)
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
  })

  it('should not request permission if already granted', async () => {
    setNotificationMocks(PermissionStatus.GRANTED)

    await initNotifications()

    expect(mockGetPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(0)
    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(1)
    expect(mockRegisterTaskAsync).toHaveBeenCalledTimes(1)
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
  })

  it('should not request permission if it is already declined', async () => {
    setNotificationMocks(PermissionStatus.DENIED, PermissionStatus.DENIED)

    await initNotifications()

    expect(mockGetPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(0)
    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(0)
    expect(mockRegisterTaskAsync).toHaveBeenCalledTimes(0)
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
  })

  describe('foreground handling', () => {
    it('should allow and pass through local and unknown notifications', async () => {
      setNotificationMocks()

      await initNotifications()

      expect(mockSetNotificationHandler).toHaveBeenCalledTimes(1)
      const handler = mockSetNotificationHandler?.mock.lastCall[0]
      expect(handler).toBeDefined()
      const handleNotificationCallback = handler.handleNotification
      expect(handleNotificationCallback).toBeDefined()

      const locallyTriggeredNotification: Notification = {
        date: 1692011606554,
        request: {
          // @ts-ignore locally triggered this can be null, so the type is wrong
          trigger: null,
          content: {
            title: 'some test title',
            data: {},
            body: 'some test body',
            sound: 'default',
            subtitle: 'some test subtitle',
          },
          identifier: '0:1692011606570797%b0aa3b58f9fd7ecd',
        },
      }
      const emptyCallResult = await handleNotificationCallback(locallyTriggeredNotification)
      expect(emptyCallResult).toEqual({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      })
      expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
    })

    // TODO use mock data for testing additional calls
  })
})
