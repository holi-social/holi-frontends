import React, { useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type CommentConnectorProps = {
  style?: StyleProp<ViewStyle>
}

const VerticalLine: React.VFC<CommentConnectorProps> = ({ style }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return <View style={[styles.connector, style]} />
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    connector: {
      minHeight: 24,
      width: 0,
      borderWidth: 0.5,
      borderColor: theme.colors.background30,
    },
  })

export default VerticalLine
