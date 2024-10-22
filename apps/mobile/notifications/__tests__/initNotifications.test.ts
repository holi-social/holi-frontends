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
import { Notification, NotificationHandler, NotificationRequestInput } from 'expo-notifications'

import { initNotifications, pushNotificationSource } from '@holi/mobile/notifications/initNotifications'

jest.mock('@holi/mobile/tracing', () => ({}))

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

  describe('pushNotificationSource', () => {
    it('should recognize novu notification', () => {
      expect(pushNotificationSource({ notificationType: 'FOOBAR' })).toEqual('novu')
    })
    it('should assume chat as source if not novu', () => {
      expect(pushNotificationSource({})).toEqual('chat')
    })
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
          shouldShowAlert: false,
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
          shouldShowAlert: false,
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
          shouldShowAlert: false,
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
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        })
        expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)

        expect(mockGetCurrentRoute).toHaveBeenCalled()
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
          shouldShowAlert: false,
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
          shouldShowAlert: false,
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
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      })
      expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(0)
    })
  })
})
/*
const iOSChatPushInForeground = {
  date: 1729594893.5957122,
  request: {
    content: {
      summaryArgumentCount: 0,
      targetContentIdentifier: null,
      threadIdentifier: '',
      interruptionLevel: 'active',
      attachments: [],
      categoryIdentifier: '',
      summaryArgument: null,
      data: null,
      title: 'holi Chat',
      subtitle: null,
      badge: 1,
      launchImageName: '',
      sound: null,
      body: 'You have a new message or invitation.',
    },
    identifier: '9F79CAE6-A463-4814-BE5C-DDDDDA6A9CCF',
    trigger: {
      payload: {
        event_id: '$RLW_stBq8JIMDT_-5xrbubmuRE6vBMg8YcWMXZM9xaA',
        room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
        experienceId: '@holistic-foundation/projectholi',
        scopeKey: '@holistic-foundation/projectholi',
        aps: {
          badge: 1,
          alert: {
            body: 'You have a new message or invitation.',
            title: 'holi Chat',
            'loc-key': 'MSG_FROM_USER_WITH_CONTENT',
            'loc-args': ['q3 LastName', 'Foreground'],
          },
        },
      },
      type: 'push',
      class: 'UNPushNotificationTrigger',
    },
  },
}

const iOSNovuPushInForeground = {
  date: 1729609553.8712692,
  request: {
    content: {
      summaryArgumentCount: 0,
      targetContentIdentifier: null,
      threadIdentifier: '',
      interruptionLevel: 'active',
      attachments: [],
      categoryIdentifier: '',
      summaryArgument: null,
      data: null,
      title: 'Request for Space 4 on holi',
      subtitle: null,
      badge: null,
      launchImageName: '',
      sound: null,
      body: 'q3 LastName wants to join Space 4\nForeground',
    },
    identifier: '64A0DE5E-21F8-4E62-A372-F0FCEDC1CC89',
    trigger: {
      payload: {
        data: {
          requestMessage: 'Foreground',
          collaboratorsLink:
            'https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be',
          space: {
            id: '2eb51ccf-e811-4686-a62e-c1d03ea93a74',
            title: 'Space 4',
            avatarDefaultColor: '#F8F860',
            avatar: '',
            name: 'space-4',
            avatarBlurhash: '',
          },
          user: {
            avatarLabel: 'QL',
            id: '34274674-088f-4dad-9d93-18aae88615be',
            avatarDefaultColor: '#F8F860',
            avatar: '',
            avatarBlurhash: '',
            fullName: 'q3 LastName',
          },
          requestDatetime: '2024-10-22T17:05:50.494117',
        },
        notificationType: 'SPACE_MEMBERSHIP_REQUEST',
        aps: { alert: { title: 'Request for Space 4 on holi', body: 'q3 LastName wants to join Space 4\nForeground' } },
        notificationVersion: '1.0.0',
      },
      type: 'push',
      class: 'UNPushNotificationTrigger',
    },
  },
}

const androidChatPushInForeground = {
  request: {
    trigger: {
      remoteMessage: {
        originalPriority: 1,
        sentTime: 1729594893295,
        notification: null,
        data: {
          channelId: 'expo_notifications_fallback_notification_channel',
          message: 'Du hast eine neue Nachricht oder Einladung.',
          event_id: '$RLW_stBq8JIMDT_-5xrbubmuRE6vBMg8YcWMXZM9xaA',
          content_body: 'Foreground',
          room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
          sender: '@q3.lastname:local.chat.holi.social',
          type: 'm.room.message',
          sender_display_name: 'q3 LastName',
          prio: 'high',
          scopeKey: '@holistic-foundation/projectholi',
          missed_calls: 'None',
          content_msgtype: 'm.text',
          experienceId: '@holistic-foundation/projectholi',
          unread: '1',
          title: 'holi Chat',
        },
        to: null,
        ttl: 2419200,
        collapseKey: null,
        messageType: null,
        priority: 1,
        from: '984061681268',
        messageId: '0:1729594893306775%90033c7ff9fd7ecd',
      },
      channelId: 'expo_notifications_fallback_notification_channel',
      type: 'push',
    },
    content: {
      title: 'holi Chat',
      badge: null,
      body: 'Du hast eine neue Nachricht oder Einladung.',
      sound: 'default',
      sticky: false,
      autoDismiss: true,
      data: {
        channelId: 'expo_notifications_fallback_notification_channel',
        message: 'Du hast eine neue Nachricht oder Einladung.',
        event_id: '$RLW_stBq8JIMDT_-5xrbubmuRE6vBMg8YcWMXZM9xaA',
        content_body: 'Foreground',
        room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
        sender: '@q3.lastname:local.chat.holi.social',
        type: 'm.room.message',
        sender_display_name: 'q3 LastName',
        prio: 'high',
        scopeKey: '@holistic-foundation/projectholi',
        missed_calls: 'None',
        content_msgtype: 'm.text',
        experienceId: '@holistic-foundation/projectholi',
        unread: '1',
        title: 'holi Chat',
      },
      priority: 'high',
      subtitle: null,
    },
    identifier: '0:1729594893306775%90033c7ff9fd7ecd',
  },
  date: 1729594893295,
}

const androidChatPushInForegroundBackgroundHandler = {
  originalPriority: 1,
  sentTime: 1729595049391,
  notification: null,
  data: {
    channelId: 'expo_notifications_fallback_notification_channel',
    message: 'Du hast eine neue Nachricht oder Einladung.',
    event_id: '$eEDBfH7uXHlI2gZE-QGCCLEkxKBzg50Sjnl3bbIOkqA',
    content_body: 'Foreground',
    room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
    sender: '@q3.lastname:local.chat.holi.social',
    type: 'm.room.message',
    sender_display_name: 'q3 LastName',
    prio: 'high',
    scopeKey: '@holistic-foundation/projectholi',
    missed_calls: 'None',
    content_msgtype: 'm.text',
    experienceId: '@holistic-foundation/projectholi',
    unread: '1',
    title: 'holi Chat',
  },
  to: null,
  ttl: 2419200,
  collapseKey: null,
  messageType: null,
  priority: 1,
  from: '984061681268',
  messageId: '0:1729595049398398%90033c7ff9fd7ecd',
}

const androidChatPushInBackgroundBackgroundHandler = {
  originalPriority: 1,
  sentTime: 1729595376930,
  notification: null,
  data: {
    channelId: 'expo_notifications_fallback_notification_channel',
    message: 'Du hast eine neue Nachricht oder Einladung.',
    event_id: '$bt2oCa00xn1i62aGxypfuqlwvgbp3CmTt3aiQJp9H6Q',
    content_body: 'Backgound',
    room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
    sender: '@q3.lastname:local.chat.holi.social',
    type: 'm.room.message',
    sender_display_name: 'q3 LastName',
    prio: 'high',
    scopeKey: '@holistic-foundation/projectholi',
    missed_calls: 'None',
    content_msgtype: 'm.text',
    experienceId: '@holistic-foundation/projectholi',
    unread: '1',
    title: 'holi Chat',
  },
  to: null,
  ttl: 2419200,
  collapseKey: null,
  messageType: null,
  priority: 1,
  from: '984061681268',
  messageId: '0:1729595376941329%90033c7ff9fd7ecd',
}

const androidNovuNotificationMessage = {
  request: {
    trigger: {
      remoteMessage: {
        originalPriority: 2,
        sentTime: 1729609319149,
        notification: {
          usesDefaultVibrateSettings: false,
          color: null,
          channelId: null,
          visibility: null,
          sound: null,
          tag: null,
          bodyLocalizationArgs: null,
          imageUrl: null,
          title: 'Request for Space 4 on holi',
          ticker: null,
          eventTime: null,
          body: 'q3 LastName wants to join Space 4\nForeground',
          titleLocalizationKey: null,
          notificationPriority: null,
          icon: null,
          usesDefaultLightSettings: false,
          sticky: false,
          link: null,
          titleLocalizationArgs: null,
          bodyLocalizationKey: null,
          usesDefaultSound: false,
          clickAction: null,
          localOnly: false,
          lightSettings: null,
          notificationCount: null,
        },
        data: {
          notificationVersion: '1.0.0',
          notificationType: 'SPACE_MEMBERSHIP_REQUEST',
          data: '{"user": {"id": "34274674-088f-4dad-9d93-18aae88615be", "fullName": "q3 LastName", "avatar": "", "avatarBlurhash": "", "avatarDefaultColor": "#F8F860", "avatarLabel": "QL"}, "space": {"id": "2eb51ccf-e811-4686-a62e-c1d03ea93a74", "name": "space-4", "title": "Space 4", "avatar": "", "avatarBlurhash": "", "avatarDefaultColor": "#F8F860"}, "requestMessage": "Foreground", "requestDatetime": "2024-10-22T17:01:57.943147", "collaboratorsLink": "https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be"}',
        },
        to: null,
        ttl: 2419200,
        collapseKey: 'social.holi.app.dev',
        messageType: null,
        priority: 2,
        from: '984061681268',
        messageId: '0:1729609319158050%90033c7f90033c7f',
      },
      channelId: null,
      type: 'push',
    },
    content: {
      title: 'Request for Space 4 on holi',
      badge: null,
      body: 'q3 LastName wants to join Space 4\nForeground',
      sound: 'default',
      sticky: false,
      autoDismiss: true,
      data: {
        notificationVersion: '1.0.0',
        notificationType: 'SPACE_MEMBERSHIP_REQUEST',
        data: '{"user": {"id": "34274674-088f-4dad-9d93-18aae88615be", "fullName": "q3 LastName", "avatar": "", "avatarBlurhash": "", "avatarDefaultColor": "#F8F860", "avatarLabel": "QL"}, "space": {"id": "2eb51ccf-e811-4686-a62e-c1d03ea93a74", "name": "space-4", "title": "Space 4", "avatar": "", "avatarBlurhash": "", "avatarDefaultColor": "#F8F860"}, "requestMessage": "Foreground", "requestDatetime": "2024-10-22T17:01:57.943147", "collaboratorsLink": "https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be"}',
      },
      priority: 'default',
      subtitle: null,
    },
    identifier: '0:1729609319158050%90033c7f90033c7f',
  },
  date: 1729609319149,
}

const androidNovuDataMessage = {
  request: {
    trigger: {
      remoteMessage: {
        originalPriority: 2,
        sentTime: 1729605441456,
        notification: null,
        data: {
          notificationType: 'SPACE_MEMBERSHIP_REQUEST',
          message: 'q3 LastName wants to join Space 4\nBackground',
          title: 'Request for Space 4 on holi',
          data: '{"requestMessage":"Background","user":{"id":"34274674-088f-4dad-9d93-18aae88615be","fullName":"q3 LastName","avatar":"","avatarBlurhash":"","avatarDefaultColor":"#F8F860","avatarLabel":"QL"},"space":{"id":"2eb51ccf-e811-4686-a62e-c1d03ea93a74","name":"space-4","title":"Space 4","avatar":"","avatarBlurhash":"","avatarDefaultColor":"#F8F860"},"requestDatetime":"2024-10-22T15:57:20.222519","collaboratorsLink":"https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be"}',
          notificationVersion: '1.0.0',
          body: 'q3 LastName wants to join Space 4\nBackground',
        },
        to: null,
        ttl: 2419200,
        collapseKey: null,
        messageType: null,
        priority: 2,
        from: '984061681268',
        messageId: '0:1729605441465478%90033c7ff9fd7ecd',
      },
      channelId: null,
      type: 'push',
    },
    content: {
      title: 'Request for Space 4 on holi',
      badge: null,
      body: 'q3 LastName wants to join Space 4\nBackground',
      sound: 'default',
      sticky: false,
      autoDismiss: true,
      data: {
        notificationType: 'SPACE_MEMBERSHIP_REQUEST',
        message: 'q3 LastName wants to join Space 4\nBackground',
        title: 'Request for Space 4 on holi',
        data: '{"requestMessage":"Background","user":{"id":"34274674-088f-4dad-9d93-18aae88615be","fullName":"q3 LastName","avatar":"","avatarBlurhash":"","avatarDefaultColor":"#F8F860","avatarLabel":"QL"},"space":{"id":"2eb51ccf-e811-4686-a62e-c1d03ea93a74","name":"space-4","title":"Space 4","avatar":"","avatarBlurhash":"","avatarDefaultColor":"#F8F860"},"requestDatetime":"2024-10-22T15:57:20.222519","collaboratorsLink":"https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be"}',
        notificationVersion: '1.0.0',
        body: 'q3 LastName wants to join Space 4\nBackground',
      },
      priority: 'default',
      subtitle: null,
    },
    identifier: '0:1729605441465478%90033c7ff9fd7ecd',
  },
  date: 1729605441456,
}
*/
