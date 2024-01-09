import { PushRuleKind } from 'matrix-js-sdk'

import { createMatrixClientMock, getClientOptions } from '@holi/chat/src/__tests__/helpers'
import ChatClient from '@holi/chat/src/client/ChatClient'

jest.mock('matrix-js-sdk')

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  beforeEach(() => {
    mxClient = createMatrixClientMock()
  })

  it('should retrieve enabled state of push notifications', async () => {
    mxClient.getPushRules.mockResolvedValueOnce({
      global: { override: [{ enabled: true, actions: [], default: false, rule_id: '' }] },
    })
    const client = new ChatClient(getClientOptions('syt_p'))

    const enabled = await client.getPushNotificationEnabledState()

    expect(enabled).toBeTruthy()
  })

  it('should update enabled state of push notifications', async () => {
    const client = new ChatClient(getClientOptions('syt_p'))

    await client.setPushNotificationsEnabled(true)

    expect(mxClient.setPushRuleEnabled).toHaveBeenCalledWith('global', PushRuleKind.Override, '.m.rule.master', true)
  })
})
