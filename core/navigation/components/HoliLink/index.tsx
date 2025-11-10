import type { PropsWithChildren } from 'react'
import React from 'react'
import { Pressable } from 'react-native'
import { Link } from 'expo-router'

import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { TextLink } from 'holi-bricks/components/text'

export const HoliLink = ({
  href,
  label,
  children,
  isFullHeight = false,
  testID = 'link',
  onPress,
}: PropsWithChildren<HoliLinkProps>) => {
  const { styles } = useStyles(stylesheet)

  const isText = typeof children === 'string'

  return (
    <Link
      href={href}
      aria-label={label}
      testID={testID}
      onPress={onPress}
      asChild
      style={[isFullHeight && styles.fullHeight]}
    >
      {isText ? <TextLink>{children}</TextLink> : <Pressable>{children}</Pressable>}
    </Link>
  )
}

const stylesheet = createStyleSheet({
  fullHeight: {
    flex: 1,
    display: 'flex',
  },
})
