import { StyleSheet as StyleSheetCreate } from 'react-native-unistyles'
import type { ExtractVariantNames } from 'react-native-unistyles/lib/typescript/src/types/variants'
import { ReactNativeStyleSheet } from 'react-native-unistyles/src/types'

export const createStyleSheet = StyleSheetCreate.create

type UseVariantsFn<T> = {
  useVariants: (variants: ExtractVariantNames<T>) => void
}

export const useStyles = <T, S extends StyleSheet = StyleSheet>(
  styles: ReactNativeStyleSheet<S> & UseVariantsFn<T>,
  variants: ExtractVariantNames<T> = {} as ExtractVariantNames<T>
): ReactNativeStyleSheet<S> => {
  styles.useVariants(variants)
  return styles
}
