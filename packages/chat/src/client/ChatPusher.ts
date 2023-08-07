import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { MatrixClient } from 'matrix-js-sdk'

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

  // TODO configure public settings in https://console.firebase.google.com/u/0/project/holi-shared/settings/general/android:social.holi.app
  // TODO set default resource location in https://console.firebase.google.com/u/0/project/holi-shared/settings/general/android:social.holi.app
  // TODO document details on which parts need to be present to make push notifications work
  // TODO - use development with expo-dev-client instead of Expo Go to test notifications, see e.g. https://docs.expo.dev/develop/development-builds/create-a-build/#create-a-development-build-for-the-device
  // TODO maybe upload google-services.json to EAS and use
  // TODO silence console.warn statements from matrix client popping up in UI
  // TODO move push gateway behind reverse proxy?
  // TODO maybe move push token retrieval to app initialization?
  // TODO subscribe to updated push tokens, see https://docs.expo.dev/versions/latest/sdk/notifications/#addpushtokenlistenerlistener
  const token = await Notifications.getDevicePushTokenAsync()
  if (token.type === 'android' || token.type === 'ios') {
    console.debug(
      `[${Device.osName}] [ChatClient.configurePusher]: configuring sygnal chat pusher with pushkey`,
      token.data
    )
    // see https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3pushersset
    // TODO make setPusher work in local environment
    await mxClient
      ?.setPusher({
        app_display_name: 'holi', // TODO add environment?
        app_id: 'social.holi', // must match app_id in sygnal config
        data: {
          //url: 'https://local.chat.holi.social:5000/_matrix/push/v1/notify',
          url: 'https://staging-push.chat.holi.social/_matrix/push/v1/notify',
          format: 'event_id_only', // default and only available value currently
        },
        device_display_name: Device.manufacturer + ' ' + Device.modelName, // TODO validate this makes sense and see where it is used
        kind: 'http',
        lang: 'en', // TODO use correct language
        profile_tag: 'override', // TODO double check what should go here
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
