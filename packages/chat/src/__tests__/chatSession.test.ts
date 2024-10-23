import { mockPlatformOS, setupPlatformOSMock } from '@holi/core/helpers/__mocks__/mockPlatformOS'

import { t } from 'i18next'
import { ClientEvent, IPushRule, PushRuleKind, RuleId } from 'matrix-js-sdk'
import { SyncState } from 'matrix-js-sdk/lib/sync'

import { IGNORE_CHAT_ADMIN_RULE_ID, ignoreChatAdminPushRule } from '@holi/chat/src/client/pusher'
import { OrySessionContext } from '@holi/core/auth/helpers/sdk'

// eslint-disable-next-line no-restricted-imports
import { startChat } from '../client/chatSession'
// eslint-disable-next-line no-restricted-imports
import { StoredCredentials } from '../utils'

let mockSetPusher: jest.Mock | undefined
let mockRemovePusher: jest.Mock | undefined
const mockAddPushRule = jest.fn().mockImplementation(
  (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scope: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    kind: PushRuleKind,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ruleId: Exclude<string, RuleId>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: Pick<IPushRule, 'actions' | 'conditions' | 'pattern'>
  ) => Promise.resolve()
)

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
      addPushRule: (
        scope: string,
        kind: PushRuleKind,
        ruleId: Exclude<string, RuleId>,
        body: Pick<IPushRule, 'actions' | 'conditions' | 'pattern'>
      ) => mockAddPushRule(scope, kind, ruleId, body),
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

describe('startChat', () => {
  setupPlatformOSMock()
  const testToken = 'some pushkey'

  it('should call the push rule configuration defining custom rules', async () => {
    const irgnoreChatAdminRuleArgs = [
      'global',
      PushRuleKind.Override,
      IGNORE_CHAT_ADMIN_RULE_ID,
      ignoreChatAdminPushRule,
    ]

    await startChat(t, testToken)

    expect(mockAddPushRule).toHaveBeenCalledTimes(1)
    expect(mockAddPushRule).toHaveBeenCalledWith(...irgnoreChatAdminRuleArgs)
  })

  describe('Android', () => {
    beforeEach(() => {
      mockPlatformOS('android')
    })

    it('should call configure pusher, which removes correct pusher and sets new one', async () => {
      mockRemovePusher = jest.fn()
      mockSetPusher = jest.fn()

      await startChat(t, testToken)

      expect(mockRemovePusher).toHaveBeenCalledTimes(1)
      expect(mockSetPusher).toHaveBeenCalledTimes(1)

      expect(mockRemovePusher.mock.lastCall).toEqual([testToken, 'our app id'])

      const pusher = mockSetPusher.mock.lastCall[0]
      expect(pusher).toEqual({
        app_display_name: 'holi',
        app_id: 'social.holi',
        data: {
          default_payload: {
            title: 'chat.push.message.title',
            message: 'chat.push.message.body',
            channelId: 'expo_notifications_fallback_notification_channel',
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
        pushkey: testToken,
      })
    })
  })

  describe('iOS', () => {
    beforeEach(() => {
      mockPlatformOS('ios')
    })

    it('should call configure pusher, which removes correct pusher and sets new one', async () => {
      mockRemovePusher = jest.fn()
      mockSetPusher = jest.fn()

      await startChat(t, testToken)

      expect(mockRemovePusher).toHaveBeenCalledTimes(1)
      expect(mockSetPusher).toHaveBeenCalledTimes(1)

      expect(mockRemovePusher.mock.lastCall).toEqual([testToken, 'our app id'])

      const pusher = mockSetPusher.mock.lastCall[0]
      expect(pusher).toEqual({
        app_display_name: 'holi',
        app_id: 'social.holi.ios',
        data: {
          default_payload: {
            aps: {
              alert: {
                title: 'chat.push.message.title',
                body: 'chat.push.message.body',
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
        pushkey: testToken,
      })
    })
  })
})
