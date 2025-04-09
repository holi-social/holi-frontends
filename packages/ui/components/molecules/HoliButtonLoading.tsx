import type React from 'react'
import { useMemo, useState } from 'react'
import { type GestureResponderEvent, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader } from '@holi/icons/src/generated'
import HoliText, { type HoliTextColor } from '@holi/ui/components/atoms/HoliText'
import HoliButton, { type HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface HoliButtonLoadingProps extends HoliButtonProps {
  icon?: HoliIconType
  loading?: boolean
  loadingLabel?: string
  color?: HoliTextColor
}

/** @description
 * A button that automatically shows a spinning loading indicator and is disabled, while the onPress handler is processed.
 * The loading state can be extended by passing in a loading property value "true", but it can't be shortened.
 * When an icon is passed, the icon is shown while not loading and is replaced by the loading indicator during the loading state.
 */
const HoliButtonLoading = ({
  loading = false,
  disabled,
  label,
  loadingLabel,
  onPress,
  testID = 'loader-btn',
  icon,
  color = 'black300',
  ...props
}: React.PropsWithChildren<HoliButtonLoadingProps & HoliButtonProps>) => {
  const [isProcessing, setProcessing] = useState(false)
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const onPressWrapper = async (event: React.SyntheticEvent | GestureResponderEvent) => {
    if (onPress) {
      setProcessing(true)
      try {
        await onPress(event)
      } finally {
        setProcessing(false)
      }
    }
  }

  const isSpinning = loading || isProcessing
  const iconToShow = isSpinning ? Loader : icon
  const labelToShow = isSpinning && loadingLabel ? loadingLabel : label

  return (
    <HoliButton label={label} disabled={disabled || isSpinning} onPress={onPressWrapper} testID={testID} {...props}>
      <HoliText style={disabled && styles.textDisabled} color={color}>
        {labelToShow}
      </HoliText>

      {iconToShow && (
        <View style={styles.icon} testID={testID + (isSpinning ? '-processing' : '-idle')}>
          <SpinningIconContainer spinning={isSpinning}>
            <HoliIcon icon={iconToShow} size={16} colorOverride={mixins[color]?.color} />
          </SpinningIconContainer>
        </View>
      )}
    </HoliButton>
  )
}

export default HoliButtonLoading

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    textDisabled: {
      color: theme.colors.foreground20,
    },
    icon: {
      marginLeft: 6,
    },
  })
