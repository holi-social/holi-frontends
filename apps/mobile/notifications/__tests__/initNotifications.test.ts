import {
  handleNotificationForBadgeUpdateTriggerAndroidMock,
  handleNotificationForBadgeUpdateTriggerIosMock,
  handleNotificationForLocalTriggerMock,
  handleNotificationForRemoteInvitationTriggerAndroidMock,
  handleNotificationForRemoteMessageTriggerAndroidMock,
  handleNotificationForRemoteMessageTriggerIosMock,
} from '@holi/core/helpers/__mocks__/mocks'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { PermissionStatus } from 'expo-modules-core'
import type { Notification, NotificationHandler, NotificationRequestInput } from 'expo-notifications'

import { initNotifications } from '@holi/mobile/notifications/initNotifications'

jest.mock('@holi/mobile/tracing', () => ({}))

jest.mock('expo-task-manager', () => {
  return { defineTask: jest.fn() }
})

// prevent matrix-sdk-internal logging noise
console.debug = jest.fn()

let mockGetCurrentRoute: jest.Mock | undefined
jest.mock('@holi/mobile/navigation/NavigationProvider', () => ({
  navigationRef: { current: { getCurrentRoute: () => mockGetCurrentRoute?.() } },
}))

let mockIsDevice: jest.Mock | undefined

jest.mock('@holi/core/helpers/isDevice', () => ({
  isDevice: () => mockIsDevice?.() ?? true, // default = true
}))

const mockGetStorage = AsyncStorage.getItem as jest.Mock
const mockWriteStorage = AsyncStorage.setItem as jest.Mock
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
  }
})

let mockGetPermissionsAsync: jest.Mock | undefined
let mockRequestPermissionsAsync: jest.Mock | undefined
let mockSetNotificationHandler: jest.Mock | undefined
let mockRegisterTaskAsync: jest.Mock | undefined
let mockScheduleNotificationAsync: jest.Mock | undefined
let mockGetDevicePushTokenAsync: jest.Mock | undefined

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: () => mockGetPermissionsAsync?.(),
  requestPermissionsAsync: () => mockRequestPermissionsAsync?.(),
  setNotificationHandler: (handler: NotificationHandler) => mockSetNotificationHandler?.(handler),
  registerTaskAsync: () => mockRegisterTaskAsync?.(),
  scheduleNotificationAsync: (input: NotificationRequestInput) => mockScheduleNotificationAsync?.(input),
  getDevicePushTokenAsync: () => mockGetDevicePushTokenAsync?.(),
}))

function setNotificationMocks(
  getStatus: PermissionStatus = PermissionStatus.UNDETERMINED,
  requestStatus: PermissionStatus = PermissionStatus.GRANTED,
  alreadyRequestedPermission = false
) {
  mockGetPermissionsAsync = jest.fn().mockReturnValue({ status: getStatus })
  mockRequestPermissionsAsync = jest.fn().mockReturnValue({ status: requestStatus })
  mockSetNotificationHandler = jest.fn()
  mockRegisterTaskAsync = jest.fn()
  mockScheduleNotificationAsync = jest.fn()
  mockGetDevicePushTokenAsync = jest.fn().mockResolvedValue({ data: 'some token', type: 'ios' })
  mockGetStorage.mockResolvedValue(alreadyRequestedPermission || undefined)
}

describe('initNotifications', () => {
  const permissionRequestedStorageKey = 'notification_permission_requested'

  it('should request permissions and set foreground and background handlers', async () => {
    setNotificationMocks()

    await initNotifications()

    expect(mockGetPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(1)
    // expect(mockRegisterTaskAsync).toHaveBeenCalledTimes(1) // not needed right now
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
    expect(mockGetDevicePushTokenAsync).toHaveBeenCalledTimes(1)
    expect(mockGetStorage).toHaveBeenCalledWith(permissionRequestedStorageKey)
    expect(mockWriteStorage).toHaveBeenCalledWith(permissionRequestedStorageKey, 'true')
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
    expect(mockGetDevicePushTokenAsync).toHaveBeenCalledTimes(0)
    expect(mockGetStorage).toHaveBeenCalledTimes(0)
    expect(mockWriteStorage).toHaveBeenCalledTimes(0)

    mockIsDevice.mockReset()
  })

  it('should not request permission if already granted', async () => {
    setNotificationMocks(PermissionStatus.GRANTED)

    await initNotifications()

    expect(mockGetPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(0)
    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(1)
    // expect(mockRegisterTaskAsync).toHaveBeenCalledTimes(1) // not needed right now
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
    expect(mockGetDevicePushTokenAsync).toHaveBeenCalledTimes(1)
    expect(mockGetStorage).toHaveBeenCalledTimes(0)
    expect(mockWriteStorage).toHaveBeenCalledTimes(0)
  })

  it('should request permission if initially declined but never requested before', async () => {
    setNotificationMocks(PermissionStatus.DENIED, PermissionStatus.DENIED, false)

    await initNotifications()

    expect(mockGetPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(0)
    expect(mockRegisterTaskAsync).toHaveBeenCalledTimes(0)
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
    expect(mockGetDevicePushTokenAsync).toHaveBeenCalledTimes(0)
    expect(mockGetStorage).toHaveBeenCalledWith(permissionRequestedStorageKey)
    expect(mockWriteStorage).toHaveBeenCalledWith(permissionRequestedStorageKey, 'true')
  })

  it('should not request permission if previous request got declined', async () => {
    setNotificationMocks(PermissionStatus.DENIED, PermissionStatus.DENIED, true)

    await initNotifications()

    expect(mockGetPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(0)
    expect(mockSetNotificationHandler).toHaveBeenCalledTimes(0)
    expect(mockRegisterTaskAsync).toHaveBeenCalledTimes(0)
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
    expect(mockGetDevicePushTokenAsync).toHaveBeenCalledTimes(0)
    expect(mockGetStorage).toHaveBeenCalledWith(permissionRequestedStorageKey)
    expect(mockWriteStorage).toHaveBeenCalledTimes(0)
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
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      })
      expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
    })

    describe('Android', () => {
      it('should re-schedule invitation notifications with real content', async () => {
        setNotificationMocks()

        await initNotifications()

        const handler = mockSetNotificationHandler?.mock.lastCall[0]
        const handleNotificationCallback = handler.handleNotification

        const emptyCallResult = await handleNotificationCallback(
          handleNotificationForRemoteInvitationTriggerAndroidMock
        )
        expect(emptyCallResult).toEqual({
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        })
        expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1)
        const notificationRequest = mockScheduleNotificationAsync?.mock.lastCall[0]
        expect(notificationRequest).toEqual({
          trigger: null,
          content: {
            title: 'Invitation',
            body: 'Someone invited you to a direct chat.',
            data: {
              room_id: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social',
            },
          },
        })
      })

      it('should re-schedule message notifications with real content', async () => {
        setNotificationMocks()

        await initNotifications()

        const handler = mockSetNotificationHandler?.mock.lastCall[0]
        const handleNotificationCallback = handler.handleNotification

        const emptyCallResult = await handleNotificationCallback(handleNotificationForRemoteMessageTriggerAndroidMock)
        expect(emptyCallResult).toEqual({
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        })
        expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1)
        const notificationRequest = mockScheduleNotificationAsync?.mock.lastCall[0]
        expect(notificationRequest).toEqual({
          trigger: null,
          content: {
            title: 'New message',
            body: 'hello world!',
            data: {
              room_id: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social',
            },
          },
        })
      })

      it('should not schedule notifications for unknown/unimportant events', async () => {
        setNotificationMocks()

        await initNotifications()

        const handler = mockSetNotificationHandler?.mock.lastCall[0]
        const handleNotificationCallback = handler.handleNotification

        const emptyCallResult = await handleNotificationCallback(handleNotificationForBadgeUpdateTriggerAndroidMock)
        expect(emptyCallResult).toEqual({
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        })
        expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
      })

      it('should skip message events when navigated in same room', async () => {
        setNotificationMocks()
        mockGetCurrentRoute = jest.fn().mockReturnValue({
          key: 'ChatRoom-Hr7733Al6mhpXQSd29to7',
          name: 'ChatRoom',
          params: { roomId: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social' },
        })

        await initNotifications()

        const handler = mockSetNotificationHandler?.mock.lastCall[0]
        const handleNotificationCallback = handler.handleNotification

        const emptyCallResult = await handleNotificationCallback(handleNotificationForRemoteMessageTriggerAndroidMock)
        expect(emptyCallResult).toEqual({
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        })
        expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)

        expect(mockGetCurrentRoute).toHaveBeenCalled()

        mockGetCurrentRoute.mockReset()
      })
    })

    describe('iOS', () => {
      it('should re-schedule message notifications with real content', async () => {
        setNotificationMocks()

        await initNotifications()

        const handler = mockSetNotificationHandler?.mock.lastCall[0]
        const handleNotificationCallback = handler.handleNotification

        const emptyCallResult = await handleNotificationCallback(handleNotificationForRemoteMessageTriggerIosMock)
        expect(emptyCallResult).toEqual({
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        })
        expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1)
        const notificationRequest = mockScheduleNotificationAsync?.mock.lastCall[0]
        expect(notificationRequest).toEqual({
          trigger: null,
          content: {
            title: 'New message',
            body: 'hello world!',
            data: {
              room_id: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social',
            },
          },
        })
      })

      it('should not schedule notifications for unknown/unimportant events', async () => {
        setNotificationMocks()

        await initNotifications()

        const handler = mockSetNotificationHandler?.mock.lastCall[0]
        const handleNotificationCallback = handler.handleNotification

        const emptyCallResult = await handleNotificationCallback(handleNotificationForBadgeUpdateTriggerIosMock)
        expect(emptyCallResult).toEqual({
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        })
        expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
      })
    })

    it('should allow display of local notifications', async () => {
      setNotificationMocks()

      await initNotifications()

      const handler = mockSetNotificationHandler?.mock.lastCall[0]
      const handleNotificationCallback = handler.handleNotification

      const emptyCallResult = await handleNotificationCallback(handleNotificationForLocalTriggerMock)
      expect(emptyCallResult).toEqual({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      })
      expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
    })
  })
})
