import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ArrowRightS, ShareBox } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { type HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

export interface MoreOptionItemProps extends HoliButtonProps {
  icon?: HoliIconType
  iconRightStyle?: 'arrow' | 'outlink'
  tintColor?: string
  bold?: boolean
  loading?: boolean
}

const MoreOptionItem = ({
  icon,
  iconRightStyle,
  loading = false,
  label,
  disabled,
  contentStyle,
  bold = true,
  tintColor,
  ...buttonProps
}: MoreOptionItemProps) => {
  const { theme } = useTheme()
  const { colors } = theme
  const color = tintColor || colors.foreground30

  return (
    <>
      <HoliButton
        inline
        transparent
        label={label}
        contentStyle={StyleSheet.flatten([styles.buttonContent, contentStyle])}
        disabled={disabled}
        {...buttonProps}
      >
        {!!icon && <HoliIcon icon={icon} colorOverride={color} style={styles.icon} />}

        <HoliText bold={bold} style={{ color }}>
          {label}
        </HoliText>

        {iconRightStyle === 'arrow' && (
          <View style={styles.iconRight}>
            <HoliIcon icon={ArrowRightS} colorOverride={color} />
          </View>
        )}
        {iconRightStyle === 'outlink' && (
          <View style={styles.iconRight}>
            <HoliIcon icon={ShareBox} colorOverride={color} />
          </View>
        )}
      </HoliButton>
      {loading && <HoliLoader style={{ backgroundColor: colors.background10 }} />}
    </>
  )
}

export default MoreOptionItem

const styles = StyleSheet.create({
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 'auto',
  },
})
