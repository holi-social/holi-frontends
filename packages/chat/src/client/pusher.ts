import * as Device from 'expo-device'
import {
  ConditionKind,
  type IPushRule,
  type IPusher,
  type IPusherRequest,
  MatrixClient,
  PushRuleActionName,
  PushRuleKind,
} from 'matrix-js-sdk'
import { Platform } from 'react-native'

import { chatAdminName, chatPushGatewayUrl } from '@holi/core/helpers/config'
import { logDebug } from '@holi/core/helpers/logging'

/**
 * Configures push notifications to use holi push notification gateway (Sygnal)
 *
 * @returns a successful promise if succeed
 */
export const configurePusher = async (client: MatrixClient, pushkey: string): Promise<void> => {
  const tokenType = Platform.OS

  const pushers: { pushers: IPusher[] } = await client.getPushers()
  await Promise.all(
    pushers.pushers
      .filter((pusher) => {
        return pusher.pushkey === pushkey
      })
      .map((pusher) => {
        logDebug(
          'ChatClient.configurePusher',
          'removing existing pusher for device push key',
          pushkey,
          JSON.stringify(pusher)
        )
        return client.removePusher(pusher.pushkey, pusher.app_id)
      })
  )

  await configurePushRules(client)

  if (tokenType === 'android' || tokenType === 'ios') {
    const app_id = tokenType === 'ios' ? 'social.holi.ios' : 'social.holi'
    let default_payload
    if (tokenType === 'android') {
      // https://docs.expo.dev/push-notifications/sending-notifications-custom/#payload-formats
      default_payload = {
        title: 'holi Chat',
        message: 'You have a new message or invitation.',
        // Android: using the default channel explicitly which ensures higher notification priority
        // https://github.com/expo/expo/blob/main/packages/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/presentation/builders/ChannelAwareNotificationBuilder.java#L25
        channelId: 'expo_notifications_fallback_notification_channel',
        experienceId: '@holistic-foundation/projectholi', // correct
        scopeKey: '@holistic-foundation/projectholi', // correct
      }
    } else if (tokenType === 'ios') {
      // https://docs.expo.dev/push-notifications/sending-notifications-custom/#payload-formats
      default_payload = {
        aps: {
          alert: {
            title: 'holi Chat',
            body: 'You have a new message or invitation.',
          },
          // badge: 0, // doesn't seem to work, is set to `1` on server
        },
        experienceId: '@holistic-foundation/projectholi', // correct
        scopeKey: '@holistic-foundation/projectholi', // correct
      }
    }

    // see https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3pushersset
    const pusherRequest: IPusherRequest = {
      app_display_name: 'holi',
      // according to https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3pushersset this should end up with the platform
      // TODO add suffix for android
      // must match app_id in sygnal config
      app_id,
      data: {
        //url: 'https://chat-push-gateway:5000/_matrix/push/v1/notify',
        url: chatPushGatewayUrl + (chatPushGatewayUrl.endsWith('/') ? '' : '/') + '_matrix/push/v1/notify',
        // @ts-ignore sygnal feature, not typed yet by matrix sdk
        default_payload,
        // `format: 'event_id_only'` would tell sygnal to omit "content", "sender",
        // "type", and "sender_display_name" from notification data
        // for now we don't want that because it helps to know this for easier notification display
      },
      device_display_name: Device.brand + ' ' + Device.modelName,
      kind: 'http',
      lang: 'en', // TODO use correct language https://holi.atlassian.net/browse/HOLI-5421
      profile_tag: 'override', // TODO double check what should go here https://holi.atlassian.net/browse/HOLI-5422
      pushkey,
      enabled: true,
    }

    logDebug('ChatClient.configurePusher', 'configure sygnal pusher', JSON.stringify(pusherRequest))

    await client?.setPusher(pusherRequest).catch((err) => {
      // TODO handle properly
      logDebug('ChatClient.configurePusher', 'error setting pusher', err)
    })

    logDebug('ChatClient.configurePusher', 'sygnal chat pusher successfully configured')
  } else {
    logDebug('ChatClient.configurePusher', 'not an ios or android token, skipping pusher configuration')
  }
}

export const IGNORE_CHAT_ADMIN_RULE_ID = 'm.rule.contains_admin'

/**
 * @description Register a push notification rule for Sygnal that ignores any
 * event notifications triggered by the `chat-admin` in the chat integration.
 * The idea is to avoid redundant notifications; for example, when a user-space
 * collaboration is accepted, we already send a background notification. Rules
 * work for both fore- and background notifications.
 */
export const ignoreChatAdminPushRule: Pick<IPushRule, 'actions' | 'conditions' | 'pattern'> = {
  actions: [PushRuleActionName.DontNotify],
  pattern: chatAdminName,
  conditions: [
    {
      kind: ConditionKind.EventMatch,
      key: 'type',
      pattern: 'm.room.member',
    },
  ],
}

/**
 * @description facilitate configuration for custom Sygnal Push Rules
 */
async function configurePushRules(client: MatrixClient): Promise<void> {
  // Ignore `chat-admin` notifications
  await client.addPushRule('global', PushRuleKind.Override, IGNORE_CHAT_ADMIN_RULE_ID, ignoreChatAdminPushRule)

  const rules = await client.getPushRules()
  logDebug('ChatClient.configurePusher', 'existing push rules', JSON.stringify(rules))
}
