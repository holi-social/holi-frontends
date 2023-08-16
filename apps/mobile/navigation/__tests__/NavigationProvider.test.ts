import * as Notifications from 'expo-notifications'

import {
  notificationResponseForLocalTriggerMock,
  notificationResponseForRemoteTriggerMock,
} from '@holi/core/helpers/__tests__/notificationMocks'
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
  addNotificationResponseReceivedListener: (listener: (event: Notifications.NotificationResponse) => void) =>
    mockAddNotificationResponseReceivedListener?.(listener),
}))

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
