import { StyleSheet as StyleSheetCreate } from 'react-native-unistyles'

// Use the same type constraint as the original create function
export const createStyleSheet: typeof StyleSheetCreate.create = (stylesheet) => StyleSheetCreate.create(stylesheet)
