// eslint-disable-next-line no-restricted-imports
import { Platform, SafeAreaView as SafeAreaViewIOS } from 'react-native'
import { SafeAreaView as SafeAreaViewAndroid } from 'react-native-safe-area-context'

export default Platform.OS === 'android' ? SafeAreaViewAndroid : SafeAreaViewIOS
