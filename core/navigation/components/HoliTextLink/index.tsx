import { TextLink } from 'holi-bricks/components/text'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { Link } from 'expo-router'
import type { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'

export const HoliTextLink = ({
  href,
  label,
  onPress,
  children,
  color,
  size,
  textAlign,
}: PropsWithChildren<HoliTextLinkProps>) => {
  return (
    <TextLink size={size} color={color} textAlign={textAlign} role="none">
      <Link href={href} onPress={onPress} aria-label={label}>
        {children}
      </Link>
    </TextLink>
  )
}
