import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliButtonLoadingProps extends HoliButtonProps {
  icon?: HoliIconType
  iconSpinning?: boolean
  label: string
  bold?: boolean
  disabled?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliButtonLoading = ({
  iconSpinning = false,
  disabled = false,
  label,
  onPress,
  testID = 'loader-btn',
  bold,
  icon,
  style,
  ...props
}: React.PropsWithChildren<HoliButtonLoadingProps & HoliButtonProps>) => {
  return (
    <HoliButton label={label} disabled={disabled} onPress={onPress} testID={testID} style={style} {...props}>
      <HoliText bold={bold} style={disabled && styles.textDisabled}>
        {label}
      </HoliText>

      {!!icon && (
        <View style={styles.icon} testID={testID + (iconSpinning ? '-processing' : '-idle')}>
          <SpinningIconContainer spinning={iconSpinning}>
            <HoliIcon icon={icon} size={16} />
          </SpinningIconContainer>
        </View>
      )}
    </HoliButton>
  )
}

export default HoliButtonLoading

const styles = StyleSheet.create({
  textDisabled: {
    color: colors.foreground20,
  },
  icon: {
    marginLeft: 6,
  },
})
