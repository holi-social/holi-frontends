import React from 'react'
import { Platform, StyleSheet } from 'react-native'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { useTheme } from '@holi/ui/styles/theme'

export type Props = Pick<LayoutProps, 'backgroundColor'>

const HeaderOffsetScrollView = ({ backgroundColor, children }: React.PropsWithChildren<LayoutProps>) => {
  const { theme } = useTheme()
  const { colors } = theme
  return (
    <SafeArea style={[styles.safeArea, { backgroundColor: backgroundColor || colors.background10 }]}>
      {children}
    </SafeArea>
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
