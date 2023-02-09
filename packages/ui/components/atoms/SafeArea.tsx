import { Platform, SafeAreaView as SafeAreaViewIOS } from 'react-native'
import { SafeAreaProvider, SafeAreaView as SafeAreaViewAndroid } from 'react-native-safe-area-context'

export { SafeAreaProvider }

export default Platform.OS === 'android' ? SafeAreaViewAndroid : SafeAreaViewIOS
