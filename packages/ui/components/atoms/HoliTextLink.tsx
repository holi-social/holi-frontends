import React from 'react'
import { StyleSheet } from 'react-native'

import useLink from '@holi/core/navigation/hooks/useLink'
import type { UseLinkProps } from '@holi/core/navigation/hooks/useLink'
import type { HoliTextSize } from '@holi/ui/components/atoms/HoliText'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type HoliLinkSize = Exclude<HoliTextSize, 'extralarge' | 'large'>
type HoliLinkVariant = 'primary' | 'secondary'

export interface HoliTextLinkProps extends UseLinkProps {
  /** Children are optional when using it in combination with the <Trans> component. */
  children?: string
  label?: string
  size?: HoliLinkSize
  variant?: HoliLinkVariant
  testID?: string
}

const HoliTextLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  size = 'default',
  variant = 'primary',
  testID = 'text-link',
}: HoliTextLinkProps) => {
  const handleLinkPress = useLink({ href, external, onPress, mobileNavigateBackFirst })

  return (
    <HoliText
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={handleLinkPress}
      size={size}
      style={styles[variant]}
      testID={testID}
      bold
    >
      {children}
    </HoliText>
  )
}

export default HoliTextLink

export const styles = StyleSheet.create({
  primary: {
    color: colors.brandColorB30,
  },
  secondary: {
    color: colors.foreground30,
  },
})
