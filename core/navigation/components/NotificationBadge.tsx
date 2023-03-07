import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export interface NotificationBadgeProps {
  visible: boolean
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const NotificationBadge = ({
  visible,
  backgroundColor = colors.background10,
  style,
  testID,
  children,
}: React.PropsWithChildren<NotificationBadgeProps>) => {
  const hasChildren = !!children

  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
      <View
        style={[
          styles.badge,
          !hasChildren && styles.standAlone,
          { borderColor: backgroundColor },
          { ...(!visible && { display: 'none' }) },
        ]}
      />
    </View>
  )
}

export default NotificationBadge

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
