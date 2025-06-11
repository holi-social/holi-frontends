import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'

export const HoliLink = ({
  href,
  label,
  children,
  isFullHeight = false,
  testID = 'link',
  onPress,
}: PropsWithChildren<HoliLinkProps>) => {
  return (
    <Link
      role="link"
      aria-label={label}
      accessible
      href={href}
      testID={testID}
      onPress={onPress}
      style={[isFullHeight && styles.fullHeight]}
    >
      {children}
    </Link>
  )
}

const styles = StyleSheet.create({
  fullHeight: {
    flex: 1,
    display: 'flex',
  },
})
