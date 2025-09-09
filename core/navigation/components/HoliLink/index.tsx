import type { PropsWithChildren } from 'react'
import React from 'react'

import { Link } from 'expo-router'
import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { TextLink } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

export const HoliLink = ({
  href,
  label,
  children,
  isFullHeight = false,
  testID = 'link',
  onPress,
  size,
}: PropsWithChildren<HoliLinkProps>) => {
  const { styles } = useStyles(stylesheet)
  return (
    <Link href={href} testID={testID} asChild style={[isFullHeight && styles.fullHeight]}>
      <TextLink role="link" aria-label={label} accessible onPress={onPress} size={size || 'sm'}>
        {children}
      </TextLink>
    </Link>
  )
}

const stylesheet = createStyleSheet({
  fullHeight: {
    flex: 1,
    display: 'flex',
  },
})
