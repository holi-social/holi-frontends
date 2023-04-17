// To ensure the user is logged out in the webview, we clear all the cookies
// Based on https://github.com/react-native-webview/react-native-webview/issues/2071 resp. https://stackoverflow.com/a/61825519
export const ensureOauth2Logout = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')
  console.log('RCTNetworking')
  console.log(RCTNetworking)
  RCTNetworking.clearCookies(() => {
    // no-op
  })
}
