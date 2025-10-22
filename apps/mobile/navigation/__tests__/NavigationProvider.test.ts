import type { NotificationResponse } from 'expo-notifications'

import { rootLinkingConfig } from '@holi/mobile/navigation/NavigationProvider'
import { setPathname } from '@holi/core/navigation/hooks/usePathname'

jest.mock('@holi/mobile/tracing', () => ({}))

// prevent matrix-sdk-internal logging noise
console.debug = jest.fn()

let mockGetInitialURL: jest.Mock | undefined
let mockAddEventListener: jest.Mock | undefined

jest.mock('expo-linking', () => ({
  createURL: (path: string) => path,
  getInitialURL: () => mockGetInitialURL?.(),
  addEventListener: (type: string, handler: unknown) => mockAddEventListener?.(type, handler),
  parse: (url: string) => ({
    path: url.replace('holi://', '').replace('https://app.holi.social/', ''),
  }),
}))

let mockGetLastNotificationResponseAsync: jest.Mock | undefined
let mockAddNotificationResponseReceivedListener: jest.Mock | undefined

jest.mock('expo-notifications', () => ({
  setBadgeCountAsync: () => false,
  getLastNotificationResponseAsync: () => mockGetLastNotificationResponseAsync?.(),
  addNotificationResponseReceivedListener: (listener: (event: NotificationResponse) => void) =>
    mockAddNotificationResponseReceivedListener?.(listener),
}))

const mockSetPathname = jest.mocked(setPathname)
jest.mock('@holi/core/navigation/hooks/usePathname', () => ({
  setPathname: jest.fn(),
}))

const notificationResponseForRemoteTriggerAndroidMock: NotificationResponse = {
  notification: {
    request: {
      trigger: {
        remoteMessage: {
          originalPriority: 1,
          sentTime: 1692015244341,
          notification: null,
          data: {
            channelId: 'expo_notifications_fallback_notification_channel',
            message: 'You have a new message or invitation.',
            content_body: 'hello world!',
            content_msgtype: 'm.text',
            room_id: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social',
            sender: '@malte1:development-chat.holi.social',
            type: 'm.room.message',
            sender_display_name: 'malte1',
            prio: 'high',
            unread: '1',
            experienceId: '@holistic-foundation/projectholi',
            scopeKey: '@holistic-foundation/projectholi',
            event_id: '$iEfUuhURTKVUoZNuUlJeMDpyIK0kSMTmhOSR1kJoGeY',
            title: 'holi Chat',
          },
          to: null,
          ttl: 2419200,
          collapseKey: null,
          messageType: null,
          priority: 1,
          from: '984061681268',
          messageId: '0:1692015244354449%b0aa3b58f9fd7ecd',
        },
        // @ts-ignore is available on android
        channelId: 'expo_notifications_fallback_notification_channel',
        type: 'push',
      },
      content: {
        categoryIdentifier: null,
        title: 'holi Chat',
        // badge: null,
        // autoDismiss: true,
        // @ts-ignore null can happen if no data is provided
        data: {
          channelId: 'expo_notifications_fallback_notification_channel',
          message: 'You have a new message or invitation.',
          content_body: 'hello world!',
          content_msgtype: 'm.text',
          room_id: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social',
          sender: '@malte1:development-chat.holi.social',
          type: 'm.room.message',
          sender_display_name: 'malte1',
          prio: 'high',
          unread: '1',
          experienceId: '@holistic-foundation/projectholi',
          scopeKey: '@holistic-foundation/projectholi',
          event_id: '$iEfUuhURTKVUoZNuUlJeMDpyIK0kSMTmhOSR1kJoGeY',
          title: 'holihat',
        },
        body: 'You have a new message or invitation.',
        sound: 'default',
        // sticky: false,
        subtitle: null,
      },
      identifier: '0:1692015244354449%b0aa3b58f9fd7ecd',
    },
    date: 1692015244341,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}

const notificationResponseForRemoteTriggerIosMock: NotificationResponse = {
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1692372734.2895498,
    request: {
      content: {
        summaryArgumentCount: 0,
        // @ts-ignore real data
        targetContentIdentifier: null,
        threadIdentifier: '',
        attachments: [],
        categoryIdentifier: '',
        summaryArgument: null,
        // @ts-ignore real data
        data: null,
        title: 'holi Chat',
        subtitle: null,
        badge: 1,
        launchImageName: '',
        sound: null,
        body: 'You have a new message or invitation.',
      },
      identifier: '4FFAA292-4F94-4AFE-99EF-0DD1D686DBE8',
      trigger: {
        payload: {
          event_id: '$C5oGwtFD5GrO-dxSNtjWTWbX9z3Gq9l1kXK4HDe8Bkw',
          room_id: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social',
          experienceId: '@holistic-foundation/projectholi',
          scopeKey: '@holistic-foundation/projectholi',
          aps: {
            badge: 1,
            alert: {
              body: 'You have a new message or invitation.',
              title: 'holi Chat',
              'loc-key': 'MSG_FROM_USER_WITH_CONTENT',
              'loc-args': ['malte1', 'hello world!!!'],
            },
          },
        },
        type: 'push',
        // @ts-ignore real data
        class: 'UNPushNotificationTrigger',
      },
    },
  },
}

const notificationResponseForLocalTriggerAndroidMock: NotificationResponse = {
  notification: {
    request: {
      // @ts-ignore null can happen if you send it with null
      trigger: null,
      content: {
        title: 'some title',
        badge: null,
        // @ts-ignore available on android
        autoDismiss: true,
        data: { room_id: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social' },
        body: 'some body',
        sound: 'default',
        sticky: false,
        subtitle: null,
      },
      identifier: 'e3319d84-02a0-4467-8159-07d48c04efc2',
    },
    date: 1692017592571,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}

const notificationResponseForLocalTriggerIosMock: NotificationResponse = {
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1692383195.93751,
    request: {
      content: {
        summaryArgumentCount: 0,
        // @ts-ignore real data
        targetContentIdentifier: null,
        threadIdentifier: '',
        attachments: [],
        categoryIdentifier: '',
        summaryArgument: '',
        data: { room_id: '!fefGYdkrNAqHkNfbVh:development-chat.holi.social' },
        title: 'New message',
        subtitle: null,
        badge: null,
        launchImageName: '',
        sound: null,
        body: 'hello world!',
      },
      identifier: '0baaf904-1b80-46d4-a370-a50a83e59a31',
      trigger: { type: 'unknown' },
    },
  },
}

describe('rootLinkingConfig', () => {
  describe('getInitialURL', () => {
    it('should call getInitialURL and respond accordingly', async () => {
      mockGetInitialURL = jest.fn().mockReturnValue('https://app.holi.social/some/link')

      const initialUrl = await rootLinkingConfig.getInitialURL?.()

      expect(initialUrl).toEqual('https://app.holi.social/some/link')
      expect(mockGetInitialURL).toHaveBeenCalledTimes(1)
      expect(mockSetPathname).toHaveBeenCalledWith('/some/link')

      mockGetInitialURL?.mockReset()
    })

    describe('Android', () => {
      it('should call getLastNotificationResponseAsync and respond correctly on remote trigger', async () => {
        mockGetLastNotificationResponseAsync = jest
          .fn()
          .mockReturnValue(notificationResponseForRemoteTriggerAndroidMock)

        const initialUrl = await rootLinkingConfig.getInitialURL?.()

        expect(initialUrl).toEqual('holi://chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
        expect(mockGetLastNotificationResponseAsync).toHaveBeenCalledTimes(1)
        expect(mockSetPathname).toHaveBeenCalledWith('/chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
      })

      it('should call getLastNotificationResponseAsync and respond correctly on local trigger', async () => {
        mockGetLastNotificationResponseAsync = jest.fn().mockReturnValue(notificationResponseForLocalTriggerAndroidMock)

        const initialUrl = await rootLinkingConfig.getInitialURL?.()

        expect(initialUrl).toEqual('holi://chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
        expect(mockGetLastNotificationResponseAsync).toHaveBeenCalledTimes(1)
        expect(mockSetPathname).toHaveBeenCalledWith('/chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
      })
    })

    describe('iOS', () => {
      it('should call getLastNotificationResponseAsync and respond correctly on iOS remote trigger', async () => {
        mockGetLastNotificationResponseAsync = jest.fn().mockReturnValue(notificationResponseForRemoteTriggerIosMock)

        const initialUrl = await rootLinkingConfig.getInitialURL?.()

        expect(initialUrl).toEqual('holi://chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
        expect(mockGetLastNotificationResponseAsync).toHaveBeenCalledTimes(1)
        expect(mockSetPathname).toHaveBeenCalledWith('/chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
      })

      it('should call getLastNotificationResponseAsync and respond correctly on iOS local trigger', async () => {
        mockGetLastNotificationResponseAsync = jest.fn().mockReturnValue(notificationResponseForLocalTriggerIosMock)

        const initialUrl = await rootLinkingConfig.getInitialURL?.()

        expect(initialUrl).toEqual('holi://chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
        expect(mockGetLastNotificationResponseAsync).toHaveBeenCalledTimes(1)
        expect(mockSetPathname).toHaveBeenCalledWith('/chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
      })
    })
  })
  describe('subscribe', () => {
    it('should call addEventListener let it react appropriately', async () => {
      mockAddEventListener = jest.fn()
      const urlResultCatcher = jest.fn()

      rootLinkingConfig.subscribe?.(urlResultCatcher)

      expect(mockAddEventListener).toHaveBeenCalledTimes(1)
      const passedType = mockAddEventListener.mock?.lastCall[0]
      const registeredListener = mockAddEventListener.mock?.lastCall[1]

      expect(passedType).toEqual('url')
      expect(registeredListener).toBeDefined()

      registeredListener({ url: 'https://app.holi.social/some/link' })
      expect(urlResultCatcher).toHaveBeenCalledTimes(1)
      expect(urlResultCatcher).toHaveBeenCalledWith('https://app.holi.social/some/link')
      expect(mockSetPathname).toHaveBeenCalledWith('/some/link')
    })

    describe('Android', () => {
      it('should call addNotificationResponseReceivedListener let it react appropriately', async () => {
        mockAddNotificationResponseReceivedListener = jest.fn()
        const urlResultCatcher = jest.fn()

        rootLinkingConfig.subscribe?.(urlResultCatcher)
        const registeredListener = mockAddNotificationResponseReceivedListener.mock?.lastCall[0]

        expect(registeredListener).toBeDefined()

        registeredListener(notificationResponseForRemoteTriggerAndroidMock)
        expect(urlResultCatcher).toHaveBeenCalledTimes(1)
        expect(urlResultCatcher).toHaveBeenCalledWith(
          'holi://chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social'
        )
        expect(mockSetPathname).toHaveBeenCalledWith('/chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')

        urlResultCatcher.mockClear()
        mockSetPathname.mockClear()

        registeredListener(notificationResponseForLocalTriggerAndroidMock)
        expect(urlResultCatcher).toHaveBeenCalledTimes(1)
        expect(urlResultCatcher).toHaveBeenCalledWith(
          'holi://chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social'
        )
        expect(mockSetPathname).toHaveBeenCalledWith('/chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
      })
    })

    describe('iOS', () => {
      it('should call addNotificationResponseReceivedListener let it react appropriately', async () => {
        mockAddNotificationResponseReceivedListener = jest.fn()
        const urlResultCatcher = jest.fn()

        rootLinkingConfig.subscribe?.(urlResultCatcher)
        const registeredListener = mockAddNotificationResponseReceivedListener.mock?.lastCall[0]

        expect(registeredListener).toBeDefined()

        registeredListener(notificationResponseForRemoteTriggerIosMock)
        expect(urlResultCatcher).toHaveBeenCalledTimes(1)
        expect(urlResultCatcher).toHaveBeenCalledWith(
          'holi://chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social'
        )
        expect(mockSetPathname).toHaveBeenCalledWith('/chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')

        urlResultCatcher.mockClear()
        mockSetPathname.mockClear()

        registeredListener(notificationResponseForLocalTriggerIosMock)
        expect(urlResultCatcher).toHaveBeenCalledTimes(1)
        expect(urlResultCatcher).toHaveBeenCalledWith(
          'holi://chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social'
        )
        expect(mockSetPathname).toHaveBeenCalledWith('/chat/rooms/!fefGYdkrNAqHkNfbVh:development-chat.holi.social')
      })
    })

    it('should remove subscriptions correctly', async () => {
      const removeMockForAddEventListener = jest.fn()
      mockAddEventListener = jest.fn().mockReturnValue({ remove: removeMockForAddEventListener })
      const removeMockForAddNotificationResponseReceivedListener = jest.fn()
      mockAddNotificationResponseReceivedListener = jest
        .fn()
        .mockReturnValue({ remove: removeMockForAddNotificationResponseReceivedListener })

      const unsubscribeFn = rootLinkingConfig.subscribe?.(jest.fn())

      unsubscribeFn?.()

      expect(removeMockForAddEventListener).toHaveBeenCalledTimes(1)
      expect(removeMockForAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(1)
      expect(mockSetPathname).not.toHaveBeenCalled()
    })
  })
})
