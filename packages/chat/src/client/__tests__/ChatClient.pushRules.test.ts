import { PushRuleKind } from 'matrix-js-sdk'

import { createChatClient, createMatrixClientMock } from '@holi/chat/src/test-utils'

jest.mock('matrix-js-sdk')

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  let client = createChatClient()

  beforeEach(() => {
    mxClient = createMatrixClientMock()
    client = createChatClient()
  })

  it('should retrieve enabled state of push notifications', async () => {
    mxClient.getPushRules.mockResolvedValueOnce({
      global: { override: [{ enabled: true, actions: [], default: false, rule_id: '' }] },
    })
    const enabled = await client.getPushNotificationEnabledState()

    expect(enabled).toBeTruthy()
  })

  it('should update enabled state of push notifications', async () => {
    await client.setPushNotificationsEnabled(true)

    expect(mxClient.setPushRuleEnabled).toHaveBeenCalledWith('global', PushRuleKind.Override, '.m.rule.master', true)
  })
})
