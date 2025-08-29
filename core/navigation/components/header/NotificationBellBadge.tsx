import React, { useMemo } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface NotificationBadgeProps {
  visible: boolean
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const NotificationBellBadge = ({
  visible,
  backgroundColor,
  style,
  testID = 'notification-bell',
  children,
}: React.PropsWithChildren<NotificationBadgeProps>) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const hasChildren = !!children

  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
      {visible && (
        <View
          style={[
            styles.badge,
            !hasChildren && styles.standAlone,
            { borderColor: backgroundColor || colors.background10 },
          ]}
          testID={testID + '-with-badge'}
        />
      )}
    </View>
  )
}

export default NotificationBellBadge

const BADGE_SIZE = 12

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      minWidth: BADGE_SIZE,
    },
    badge: {
      position: 'absolute',
      width: BADGE_SIZE,
      height: BADGE_SIZE,
      top: 0,
      right: 0,
      backgroundColor: theme.colors.brandColorB30,
      borderRadius: BADGE_SIZE / 2,
      borderWidth: 2,
    },
    standAlone: {
      top: 4,
    },
  })
