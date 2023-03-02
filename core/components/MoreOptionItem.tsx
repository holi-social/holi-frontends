import React from 'react'
import { StyleSheet } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export interface MoreOptionItemProps extends HoliButtonProps {
  icon?: string
  arrowRight?: boolean
  tintColor?: string
}

const MoreOptionItem: React.VFC<MoreOptionItemProps> = ({
  icon,
  arrowRight = false,
  tintColor = colors.foreground20,
  label,
  disabled,
  contentStyle,
  ...buttonProps
}) => {
  return (
    <HoliButton
      inline
      transparent
      label={label}
      contentStyle={[styles.buttonContent, contentStyle]}
      disabled={disabled}
      {...buttonProps}
    >
      {!!icon && <HoliIcon icon={icon} size={24} filled={false} color={tintColor} style={[styles.icon]} />}

      <HoliText bold style={[{ color: tintColor }]}>
        {label}
      </HoliText>

      {arrowRight && (
        <HoliIcon icon="arrow-right-s" size={24} filled={false} color={tintColor} style={[styles.arrowRight]} />
      )}
    </HoliButton>
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
  arrowRight: {
    marginLeft: 'auto',
  },
})
