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

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minWidth: 12,
  },
  badge: {
    position: 'absolute',
    width: 12,
    height: 12,
    top: 0,
    right: 0,
    backgroundColor: colors.brandColorB30,
    borderRadius: 6,
    borderWidth: 2,
  },
  standAlone: {
    top: 4,
  },
})
