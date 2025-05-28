import { StyleSheet as StyleSheetCreate } from 'react-native-unistyles'
import { useBricks } from 'holi-bricks/foundations/colors/themes/useBricks'

export const createStyleSheet = StyleSheetCreate.create

type InferVariants<T> = T extends { useVariants: (v: infer V) => void } ? V : never

export const useStyles = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends { useVariants: (v: any) => void },
>(
  stylesheet: S,
  variants: InferVariants<S>
) => {
  const { theme } = useBricks()
  stylesheet.useVariants(variants)

  return {
    styles: stylesheet as Omit<typeof stylesheet, 'useVariants'>,
    theme,
  }
}
