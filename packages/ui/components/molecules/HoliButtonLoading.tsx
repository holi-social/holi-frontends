import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliButtonLoadingProps = {
  icon?: string
  iconSpinning?: boolean
  label: string
  bold?: boolean
  disabled?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliButtonLoading: React.FC<HoliButtonLoadingProps & HoliButtonProps> = ({
  iconSpinning = false,
  disabled = false,
  label,
  onPress,
  testID,
  bold,
  icon,
  style,
  ...props
}) => {
  return (
    <HoliButton label={label} disabled={disabled} onPress={onPress} testID={testID} style={style} {...props}>
      <HoliText bold={bold} style={disabled && styles.textDisabled}>
        {label}
      </HoliText>
      {icon && (
        <View style={styles.icon}>
          <HoliIcon spinning={!!icon && iconSpinning} icon={icon} size={16} />
        </View>
      )}
    </HoliButton>
  )
}

export default HoliButtonLoading

const styles = StyleSheet.create({
  textDisabled: {
    color: colors.fontColorGrey,
  },
  icon: {
    marginLeft: 6,
  },
})
