import Link from 'next/link'
import React, { SyntheticEvent } from 'react'
import { StyleSheet } from 'react-native'

import HoliText from '@holi//ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

import type { HoliLinkProps } from './HoliLink'
import webStyles from './HoliLink.module.scss'

const HoliLink: React.FC<HoliLinkProps> = ({
  href,
  label,
  external = false,
  onPress,
  children,
  style,
  textStyle,
  testID = 'text-link',
}) => {
  const onLinkPress = React.useCallback(
    (event: SyntheticEvent<HTMLAnchorElement, Event>) => {
      const stopPropagation = onPress?.()
      if (stopPropagation === false) {
        event?.preventDefault()
        event?.stopPropagation()
        return false
      }
    },
    [onPress]
  )

  return (
    <Link href={href}>
      <a
        aria-label={label}
        title={label}
        target={external ? '_blank' : undefined}
        className={webStyles.link}
        style={StyleSheet.flatten([style])}
        onClick={onLinkPress}
        data-testid={testID}
      >
        <HoliText style={[styles.linkText, textStyle]}>{children}</HoliText>
      </a>
    </Link>
  )
}

export default HoliLink

const styles = StyleSheet.create({
  linkText: {
    color: colors.fontColorHighlighted,
  },
})
