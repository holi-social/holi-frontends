import React from 'react'
import { Platform, StyleSheet } from 'react-native'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { colors } from '@holi/ui/styles/globalVars'

export type Props = Pick<LayoutProps, 'backgroundColor'>

const HeaderOffsetScrollView = ({
  backgroundColor = colors.background10,
  children,
}: React.PropsWithChildren<LayoutProps>) => (
  <SafeArea style={[styles.safeArea, { backgroundColor }]}>{children}</SafeArea>
)

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
