import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { IPusher, IPusherRequest, MatrixClient } from 'matrix-js-sdk'
import { Platform } from 'react-native'

import { chatPushGatewayUrl } from '@holi/core/helpers/config'
import { logDebug } from '@holi/core/helpers/logging'

/**
 * Configures push notifications to use holi push notification gateway (Sygnal)
 *
 * @returns a successful promise if succeed
 */
export const configurePusher = async (mxClient: MatrixClient): Promise<void> => {
  const token = await Notifications.getDevicePushTokenAsync()
  logDebug('ChatClient.configurePusher', 'got token', JSON.stringify(token))
  const pushkey = token.data

  const pushers: { pushers: IPusher[] } = await mxClient.getPushers()
  await Promise.all(
    pushers.pushers
      .filter((pusher) => pusher.pushkey === pushkey)
      .map((pusher) => {
        logDebug(
          'ChatClient.configurePusher',
          'removing existing pusher for device push key',
          pushkey,
          JSON.stringify(pusher)
        )
        return mxClient.removePusher(pusher.pushkey, pusher.app_id)
      })
  )
  await mxClient.getPushRules().then((rules) => {
    logDebug('ChatClient.configurePusher', 'existing push rules', JSON.stringify(rules))
  })

  if (token.type === 'android' || token.type === 'ios') {
    // see https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3pushersset
    const pusherRequest: IPusherRequest = {
      app_display_name: 'holi',
      app_id: 'social.holi', // must match app_id in sygnal config
      data: {
        //url: 'https://chat-push-gateway:5000/_matrix/push/v1/notify',
        url: chatPushGatewayUrl + '/_matrix/push/v1/notify',
        // @ts-ignore sygnal feature, not typed yet by matrix sdk
        default_payload: {
          // https://docs.expo.dev/push-notifications/sending-notifications-custom/#payload-formats
          title: 'holi Chat',
          message: 'You have a new message or invitation.',
          // Android: using the default channel explicitly which ensures higher notification priority
          // https://github.com/expo/expo/blob/main/packages/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/presentation/builders/ChannelAwareNotificationBuilder.java#L25
          channelId: 'expo_notifications_fallback_notification_channel',
          experienceId: '@holistic-foundation/projectholi', // correct
          scopeKey: '@holistic-foundation/projectholi', // correct
        },
        // `format: 'event_id_only'` would tell sygnal to omit "content", "sender",
        // "type", and "sender_display_name" from notification data
        // for now we don't want that because it helps to know this for easier notification display
      },
      device_display_name: Platform.OS == 'web' ? 'Web Browser' : Device.brand + ' ' + Device.modelName,
      kind: 'http',
      lang: 'en', // TODO use correct language https://holi.atlassian.net/browse/HOLI-5421
      profile_tag: 'override', // TODO double check what should go here https://holi.atlassian.net/browse/HOLI-5422
      pushkey,
      enabled: true,
    }
    logDebug('ChatClient.configurePusher', 'configure sygnal pusher', JSON.stringify(pusherRequest))
    await mxClient?.setPusher(pusherRequest).catch((err) => {
      // TODO handle properly
      logDebug('ChatClient.configurePusher', 'error setting pusher', err)
    })
    logDebug('ChatClient.configurePusher', 'sygnal chat pusher successfully configured')
  } else {
    logDebug('ChatClient.configurePusher', 'not an ios or android token, skipping pusher configuration')
  }
}
