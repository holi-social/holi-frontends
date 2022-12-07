import Link from 'next/link'
import * as React from 'react'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'

import HoliText from '@holi//ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliLink = {
  href: string
  label: string
  external?: boolean
  onPress?: CallableFunction
  style?: StyleProp<TextStyle>
  testID?: string
}

const HoliLink: React.FC<HoliLink> = ({
  href,
  label,
  external = false,
  onPress,
  children,
  style,
  testID = 'text-link',
}) => {
  return (
    <Link href={href}>
      <a
        onClick={onPress as React.MouseEventHandler<HTMLAnchorElement>}
        aria-label={label}
        target={external ? '_blank' : undefined}
        data-testid={testID}
      >
        <HoliText style={[styles.link, style]}>{children}</HoliText>
      </a>
    </Link>
  )
}

export default HoliLink

const styles = StyleSheet.create({
  link: {
    color: colors.fontColorHighlighted,
  },
})
