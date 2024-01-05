import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export interface NotificationBadgeProps {
  showBadge: boolean
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliIconBadge = ({
  showBadge,
  backgroundColor = colors.background10,
  style,
  children,
}: React.PropsWithChildren<NotificationBadgeProps>) => {
  const hasNoIcon = !children

  return (
    <View style={[styles.container, style]}>
      {children}
      {showBadge && <View style={[styles.badge, hasNoIcon && styles.standAlone, { borderColor: backgroundColor }]} />}
    </View>
  )
}

export default HoliIconBadge

const BADGE_SIZE = 12

const styles = StyleSheet.create({
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
    backgroundColor: colors.brandColorB30,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 2,
  },
  standAlone: {
    top: 4,
  },
})
