import { ClientEvent } from 'matrix-js-sdk'
import { SyncState } from 'matrix-js-sdk/lib/sync'

import { OrySessionContext } from '@holi/core/auth/helpers/sdk'

// eslint-disable-next-line no-restricted-imports
import { startChat } from '../client/chatSession'
// eslint-disable-next-line no-restricted-imports
import { StoredCredentials } from '../utils'

let mockSetPusher: jest.Mock | undefined
let mockRemovePusher: jest.Mock | undefined

// prevent matrix-sdk-internal logging noise
console.debug = jest.fn()

jest.mock('matrix-js-sdk', () => {
  return {
    ...jest.requireActual('matrix-js-sdk'),
    createClient: () => ({
      setGuest: () => null,
      setNotifTimelineSet: () => null,
      startClient: () => null,
      on: (type: ClientEvent, callback: (state: SyncState) => void) => {
        if (type === 'sync') {
          callback('PREPARED' as SyncState)
        }
      },
      getPushRules: () => Promise.resolve(),
      getPushers: () =>
        Promise.resolve({
          pushers: [
            { pushkey: 'other pushkey', app_id: 'our app id' },
            { pushkey: 'some pushkey', app_id: 'our app id' },
          ],
        }),
      removePusher: (pushkey: string, app_id: string) => mockRemovePusher?.(pushkey, app_id),
      setPusher: (pusher: unknown) => {
        mockSetPusher?.(pusher)
        return Promise.resolve()
      },
    }),
    EventTimelineSet: class {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      constructor() {}

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      getLiveTimeline() {
        return { setPaginationToken: () => null }
      }
    },
  }
})

jest.mock('@holi/core/helpers/config', () => ({
  chatServerUrl: 'some.chat.server.url',
  chatPushGatewayUrl: 'some.push.gateway.url',
}))

jest.mock('@holi/core/auth/helpers/auth', () => ({
  getSessionFromStorage: (): Promise<Partial<OrySessionContext>> =>
    Promise.resolve({
      session_token: 'some session token for ory',
    }),
}))

jest.mock('@holi/chat/src/utils/storage', () => ({
  loadSessionCredentials: (): Promise<StoredCredentials> =>
    Promise.resolve({
      access_token: 'some access token for matrix',
      device_id: 'some device id',
      user_id: 'some user id',
      fresh_login: true,
    }),
}))

let mockGetDevicePushTokenAsync: jest.Mock | undefined

jest.mock('expo-notifications', () => ({
  getDevicePushTokenAsync: () => mockGetDevicePushTokenAsync?.(),
}))

describe('startChat', () => {
  describe('Android', () => {
    it('should call configure pusher, which removes correct pusher and sets new one', async () => {
      mockGetDevicePushTokenAsync = jest.fn().mockReturnValue({ type: 'android', data: 'some pushkey' })
      mockRemovePusher = jest.fn()
      mockSetPusher = jest.fn()

      await startChat()

      expect(mockGetDevicePushTokenAsync).toHaveBeenCalledTimes(1)
      expect(mockRemovePusher).toHaveBeenCalledTimes(1)
      expect(mockSetPusher).toHaveBeenCalledTimes(1)

      expect(mockRemovePusher.mock.lastCall).toEqual(['some pushkey', 'our app id'])

      const pusher = mockSetPusher.mock.lastCall[0]
      expect(pusher).toEqual({
        app_display_name: 'holi',
        app_id: 'social.holi',
        data: {
          default_payload: {
            channelId: 'expo_notifications_fallback_notification_channel',
            title: 'holi Chat',
            message: 'You have a new message or invitation.',
            experienceId: '@holistic-foundation/projectholi',
            scopeKey: '@holistic-foundation/projectholi',
          },
          url: 'some.push.gateway.url/_matrix/push/v1/notify',
        },
        device_display_name: 'mock mock',
        enabled: true,
        kind: 'http',
        lang: 'en',
        profile_tag: 'override',
        pushkey: 'some pushkey',
      })
    })
  })

  describe('iOS', () => {
    it('should call configure pusher, which removes correct pusher and sets new one', async () => {
      mockGetDevicePushTokenAsync = jest.fn().mockReturnValue({ type: 'ios', data: 'some pushkey' })
      mockRemovePusher = jest.fn()
      mockSetPusher = jest.fn()

      await startChat()

      expect(mockGetDevicePushTokenAsync).toHaveBeenCalledTimes(1)
      expect(mockRemovePusher).toHaveBeenCalledTimes(1)
      expect(mockSetPusher).toHaveBeenCalledTimes(1)

      expect(mockRemovePusher.mock.lastCall).toEqual(['some pushkey', 'our app id'])

      const pusher = mockSetPusher.mock.lastCall[0]
      expect(pusher).toEqual({
        app_display_name: 'holi',
        app_id: 'social.holi.ios',
        data: {
          default_payload: {
            aps: {
              alert: {
                title: 'holi Chat',
                body: 'You have a new message or invitation.',
              },
            },
            experienceId: '@holistic-foundation/projectholi',
            scopeKey: '@holistic-foundation/projectholi',
          },
          url: 'some.push.gateway.url/_matrix/push/v1/notify',
        },
        device_display_name: 'mock mock',
        enabled: true,
        kind: 'http',
        lang: 'en',
        profile_tag: 'override',
        pushkey: 'some pushkey',
      })
    })
  })
})
