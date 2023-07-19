import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ArrowRightS, ShareBox } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'

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
  tintColor = colors.foreground30,
  loading = false,
  label,
  disabled,
  contentStyle,
  bold = true,
  ...buttonProps
}: MoreOptionItemProps) => {
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
        {!!icon && <HoliIcon icon={icon} color={tintColor} style={styles.icon} />}

        <HoliText bold={bold} style={{ color: tintColor }}>
          {label}
        </HoliText>

        {iconRightStyle === 'arrow' && (
          <View style={styles.iconRight}>
            <HoliIcon icon={ArrowRightS} color={tintColor} />
          </View>
        )}
        {iconRightStyle === 'outlink' && (
          <View style={styles.iconRight}>
            <HoliIcon icon={ShareBox} color={tintColor} />
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
