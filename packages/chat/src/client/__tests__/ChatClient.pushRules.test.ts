import { MatrixClient, PushRuleKind } from 'matrix-js-sdk'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { createChatClient, createMatrixClientMock } from '@holi/chat/src/test-utils'

jest.mock('matrix-js-sdk')

describe('ChatClient', () => {
  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let client: ChatClient

  beforeEach(() => {
    mxClient = createMatrixClientMock()
    client = createChatClient()
  })

  it('should retrieve enabled state of push notifications', async () => {
    mxClient.getPushRules.mockResolvedValueOnce({
      global: { override: [{ enabled: true, actions: [], default: false, rule_id: '' }] },
    })
    const enabled = await client.getPushNotificationEnabledState()

    expect(enabled).toBeFalsy() // when the global rule is enabled, push notifications are disabled
  })

  it('enabling push notifications should deactivate the overriding empty global push master rule', async () => {
    await client.setPushNotificationsEnabled(true)

    expect(mxClient.setPushRuleEnabled).toHaveBeenCalledWith('global', PushRuleKind.Override, '.m.rule.master', false)
  })
})
