import type { PropsWithChildren } from 'react'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import useLink from '@holi/core/navigation/hooks/useLink'

export const HoliLink = ({
  href,
  label,
  external,
  onPress,
  children,
  isFullHeight = false,
  testID = 'link',
}: PropsWithChildren<HoliLinkProps>) => {
  const handleLinkPress = useLink({ href, external, onPress })

  return (
    <Pressable
      role="link"
      aria-label={label}
      accessible
      onPress={handleLinkPress}
      testID={testID}
      style={[isFullHeight && styles.fullHeight]}
    >
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fullHeight: {
    flex: 1,
    display: 'flex',
  },
})
