// Based on https://github.com/react-native-webview/react-native-webview/issues/2071 resp. https://stackoverflow.com/a/61825519
export const clearWebviewCookies = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')
  RCTNetworking.clearCookies(() => {
    // no-op
  })
}
