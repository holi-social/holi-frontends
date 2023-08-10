import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { MatrixClient } from 'matrix-js-sdk'
import { Platform } from 'react-native'

import { pushGatewayUrl } from '@holi/core/helpers/config'

/**
 * Configures push notifications to use holi push notification gateway (Sygnal)
 *
 * @returns a successful promise if succeed
 */
export const configurePusher = async (mxClient: MatrixClient): Promise<void> => {
  // only set up push notifications if this is a real device (not a simulator, not web)
  //if (Device.isDevice) {
  console.debug(`[${Device.osName}] [ChatClient.configurePusher]`)
  const pushers = await mxClient.getPushers()
  await Promise.all(
    pushers.pushers.map((pusher) => {
      // TODO don't remove all pushers, only the ones that are not for this device id
      console.debug(`[${Device.osName}] [ChatClient.configurePusher]: removing existing pusher`, JSON.stringify(pusher))
      return mxClient.removePusher(pusher.pushkey, pusher.app_id)
    })
  )
  mxClient.getPushRules().then((rules) => {
    console.debug(`[${Device.osName}] [ChatClient.configurePusher]: existing push rules`, JSON.stringify(rules))
  })

  const token = await Notifications.getDevicePushTokenAsync()
  if (token.type === 'android' || token.type === 'ios') {
    console.debug(
      `[${Device.osName}] [ChatClient.configurePusher]: configuring sygnal chat pusher with pushkey`,
      token.data
    )
    // see https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3pushersset
    await mxClient
      ?.setPusher({
        app_display_name: 'holi', // TODO add environment?
        app_id: 'social.holi', // must match app_id in sygnal config
        data: {
          //url: 'https://chat-push-gateway:5000/_matrix/push/v1/notify',
          url: pushGatewayUrl + '/_matrix/push/v1/notify',

          // `format: 'event_id_only'` would tell sygnal to omit "content", "sender",
          // "type", and "sender_display_name" from notification data
          // for now we don't want that because it helps to know this for easier notification display
        },
        device_display_name: Platform.OS == 'web' ? 'Web Browser' : Device.brand + ' ' + Device.modelName,
        kind: 'http',
        lang: 'en', // TODO use correct language https://holi.atlassian.net/browse/HOLI-5421
        profile_tag: 'override', // TODO double check what should go here https://holi.atlassian.net/browse/HOLI-5422
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pushkey: token.data,
        enabled: true,
      })
      .catch((err) => {
        // TODO handle properly
        // eslint-disable-next-line no-console
        console.error(`[${Device.osName}] [ChatClient.configurePusher]: error setting pusher`, err)
      })
    console.debug(`[${Device.osName}] [ChatClient.configurePusher]: sygnal chat pusher configured`)
  } else {
    console.debug(
      `[${Device.osName}] [ChatClient.configurePusher]: not an ios or android token, skipping pusher configuration`
    )
  }
  //} else {
  //  console.debug('[ChatClient.configurePusher]: not a real device, skipping pusher configuration')
  //}
}
