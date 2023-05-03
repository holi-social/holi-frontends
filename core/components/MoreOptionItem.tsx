import React from 'react'
import { StyleSheet } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'

export interface MoreOptionItemProps extends HoliButtonProps {
  icon?: string
  iconRight?: boolean
  tintColor?: string
  bold?: boolean
  loading?: boolean
}

const MoreOptionItem: React.VFC<MoreOptionItemProps> = ({
  icon,
  iconRight,
  tintColor = colors.foreground30,
  loading = false,
  label,
  disabled,
  contentStyle,
  bold = true,
  ...buttonProps
}) => {
  return (
    <>
      <HoliButton
        inline
        transparent
        label={label}
        contentStyle={[styles.buttonContent, contentStyle]}
        disabled={disabled}
        {...buttonProps}
      >
        {!!icon && <HoliIcon icon={icon} size={24} filled={false} color={tintColor} style={styles.icon} />}

        <HoliText bold={bold} style={{ color: tintColor }}>
          {label}
        </HoliText>

        {iconRight === 'arrow' && (
          <HoliIcon icon="arrow-right-s" size={24} filled={false} color={tintColor} style={styles.iconRight} />
        )}
        {iconRight === 'outlink' && (
          <HoliIcon icon="share-box" size={24} filled={false} color={tintColor} style={styles.iconRight} />
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
