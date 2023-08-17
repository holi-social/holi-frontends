import { NotificationResponse } from 'expo-notifications'

import { rootLinkingConfig } from '@holi/mobile/navigation/NavigationProvider'

jest.mock('@holi/mobile/tracing', () => ({}))

let mockGetInitialURL: jest.Mock | undefined
let mockAddEventListener: jest.Mock | undefined

jest.mock('expo-linking', () => ({
  createURL: (path: string) => path,
  getInitialURL: () => mockGetInitialURL?.(),
  addEventListener: (type: string, handler: unknown) => mockAddEventListener?.(type, handler),
}))

let mockGetLastNotificationResponseAsync: jest.Mock | undefined
let mockAddNotificationResponseReceivedListener: jest.Mock | undefined

jest.mock('expo-notifications', () => ({
  getLastNotificationResponseAsync: () => mockGetLastNotificationResponseAsync?.(),
  addNotificationResponseReceivedListener: (listener: (event: NotificationResponse) => void) =>
    mockAddNotificationResponseReceivedListener?.(listener),
}))

const notificationResponseForRemoteTriggerMock: NotificationResponse = {
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
            content: '{"body":"hello world!","msgtype":"m.text"}',
            room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social',
            sender: '@malte1:staging.chat.holi.social',
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
        title: 'holi Chat',
        badge: null,
        autoDismiss: true,
        // @ts-ignore null can happen if no data is provided
        data: null,
        body: 'You have a new message or invitation.',
        sound: 'default',
        sticky: false,
        subtitle: null,
      },
      identifier: '0:1692015244354449%b0aa3b58f9fd7ecd',
    },
    date: 1692015244341,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}

const notificationResponseForLocalTriggerMock: NotificationResponse = {
  notification: {
    request: {
      // @ts-ignore null can happen if you send it with null
      trigger: null,
      content: {
        title: 'some title',
        badge: null,
        // @ts-ignore available on android
        autoDismiss: true,
        data: { room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social' },
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

describe('rootLinkingConfig', () => {
  describe('getInitialURL', () => {
    it('should call getInitialURL and respond accordingly', async () => {
      mockGetInitialURL = jest.fn().mockReturnValue('https://app.holi.social/some/link')

      const initialUrl = await rootLinkingConfig.getInitialURL?.()

      expect(initialUrl).toEqual('https://app.holi.social/some/link')
      expect(mockGetInitialURL).toHaveBeenCalledTimes(1)
    })

    it('should call getLastNotificationResponseAsync and respond correctly on remote trigger', async () => {
      mockGetLastNotificationResponseAsync = jest.fn().mockReturnValue(notificationResponseForRemoteTriggerMock)

      const initialUrl = await rootLinkingConfig.getInitialURL?.()

      expect(initialUrl).toEqual('https://app.holi.social/chat/rooms/!qwGdHhthYWLZHsDwuG:staging.chat.holi.social')
      expect(mockGetLastNotificationResponseAsync).toHaveBeenCalledTimes(1)
    })

    it('should call getLastNotificationResponseAsync and respond correctly on local trigger', async () => {
      mockGetLastNotificationResponseAsync = jest.fn().mockReturnValue(notificationResponseForLocalTriggerMock)

      const initialUrl = await rootLinkingConfig.getInitialURL?.()

      expect(initialUrl).toEqual('https://app.holi.social/chat/rooms/!qwGdHhthYWLZHsDwuG:staging.chat.holi.social')
      expect(mockGetLastNotificationResponseAsync).toHaveBeenCalledTimes(1)
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
    })

    it('should call addNotificationResponseReceivedListener let it react appropriately', async () => {
      mockAddNotificationResponseReceivedListener = jest.fn()
      const urlResultCatcher = jest.fn()

      rootLinkingConfig.subscribe?.(urlResultCatcher)
      const registeredListener = mockAddNotificationResponseReceivedListener.mock?.lastCall[0]

      expect(registeredListener).toBeDefined()

      registeredListener(notificationResponseForRemoteTriggerMock)
      expect(urlResultCatcher).toHaveBeenCalledTimes(1)
      expect(urlResultCatcher).toHaveBeenCalledWith(
        'https://app.holi.social/chat/rooms/!qwGdHhthYWLZHsDwuG:staging.chat.holi.social'
      )

      urlResultCatcher.mockClear()

      registeredListener(notificationResponseForLocalTriggerMock)
      expect(urlResultCatcher).toHaveBeenCalledTimes(1)
      expect(urlResultCatcher).toHaveBeenCalledWith(
        'https://app.holi.social/chat/rooms/!qwGdHhthYWLZHsDwuG:staging.chat.holi.social'
      )
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
    })
  })
})
