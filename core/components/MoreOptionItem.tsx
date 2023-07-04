import React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'

export interface MoreOptionItemProps extends HoliButtonProps {
  icon?: string
  iconRight?: string
  tintColor?: string
  bold?: boolean
  loading?: boolean
}

const MoreOptionItem = ({
  icon,
  iconRight,
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
        {!!icon && <HoliIcon icon={icon} size={24} filled={false} color={tintColor} style={styles.icon} />}

        <HoliText bold={bold} style={{ color: tintColor }}>
          {label}
        </HoliText>

        {iconRight === 'arrow' && (
          <View style={styles.iconRight}>
            <HoliIcon icon="arrow-right-s" size={24} filled={false} color={tintColor} />
          </View>
        )}
        {iconRight === 'outlink' && (
          <View style={styles.iconRight}>
            <HoliIcon icon="share-box" size={24} filled={false} color={tintColor} style={styles.iconRight} />
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
