import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet } from 'react-native'

import HoliNavigationLink from '@holi/ui/components/atoms/HoliNavigationLink'
import type { HoliNavigationLinkProps } from '@holi/ui/components/atoms/HoliNavigationLink'
import type { HoliTextSize } from '@holi/ui/components/atoms/HoliText'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliTextLinkProps extends HoliNavigationLinkProps {
  size?: HoliLinkSize
  variant?: HoliLinkVariant
}

type HoliLinkSize = Exclude<HoliTextSize, 'extralarge' | 'large'>
type HoliLinkVariant = 'primary' | 'secondary'

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
}: PropsWithChildren<HoliTextLinkProps>) => {
  return (
    <HoliNavigationLink
      external={external}
      href={href}
      label={label}
      onPress={onPress}
      testID={testID}
      mobileNavigateBackFirst={mobileNavigateBackFirst}
    >
      <HoliText size={size} style={styles[variant]} bold>
        {children}
      </HoliText>
    </HoliNavigationLink>
  )
}

export default HoliTextLink

export const styles = StyleSheet.create({
  primary: {
    color: colors.brandColorB30,
  },
  secondary: {
    color: colors.background10,
  },
})
