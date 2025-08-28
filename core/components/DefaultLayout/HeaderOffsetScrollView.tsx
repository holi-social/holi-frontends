import type React from 'react'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import { useTheme } from '@holi/ui/styles/theme'

export type Props = Pick<LayoutProps, 'backgroundColor'>

const HeaderOffsetScrollView = ({ backgroundColor, children }: React.PropsWithChildren<LayoutProps>) => {
  const { theme } = useTheme()
  const { colors } = theme
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          backgroundColor: backgroundColor || colors.background10,
        },
      ]}
    >
      {children}
    </View>
  )
}

export default HeaderOffsetScrollView

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: {
        minHeight: '100%',
      },
    }),
  },
})
