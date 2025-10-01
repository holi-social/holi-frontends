import type { PropsWithChildren } from 'react'
import React from 'react'

import { Link } from 'expo-router'
import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

export const HoliLink = ({
  href,
  label,
  children,
  isFullHeight = false,
  testID = 'link',
  onPress,
}: PropsWithChildren<HoliLinkProps>) => {
  const { styles } = useStyles(stylesheet)
  return (
    <Link href={href} aria-label={label} testID={testID} onPress={onPress} style={[isFullHeight && styles.fullHeight]}>
      {children}
    </Link>
  )
}

const stylesheet = createStyleSheet({
  fullHeight: {
    flex: 1,
    display: 'flex',
  },
})
