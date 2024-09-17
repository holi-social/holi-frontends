import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface FirstVisitOnboardingSelectionOption {
  id: string
  image?: StaticImageData
  mobileOnly?: boolean
}

interface FirstVisitOnboardingSelectionProps {
  options: FirstVisitOnboardingSelectionOption[]
  initialSelection?: string
  onSelect: (selection: string) => void
  step: string
}

export const FirstVisitOnboardingSelection = ({
  options = [],
  initialSelection,
  onSelect,
  step,
}: FirstVisitOnboardingSelectionProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { width: screenWidth } = useClientWindowDimensions()
  const styles = useMemo(() => getStyles(theme, screenWidth), [theme, screenWidth])
  const [selectedOption, setSelectedOption] = useState(initialSelection)
  const visibleOptions = Platform.OS === 'web' ? options.filter((option) => !option.mobileOnly) : options

  const onSelectOption = useCallback(
    (id: string) => {
      onSelect(id)
      setSelectedOption(id)
    },
    [onSelect]
  )

  if (!visibleOptions.length) {
    return null
  }
  return (
    <View style={styles.optionsContainer}>
      {visibleOptions.map((option) => {
        const isSelected = option.id === selectedOption
        const label = t(`onboarding.firstVisit.${step}.option.${option.id}`)
        return (
          <Pressable
            key={option.id}
            style={({ hovered }) => [styles.option, (hovered || isSelected) && styles.optionHovered]}
            onPress={() => onSelectOption(option.id)}
            testID={`option-${option.id}`}
          >
            <View style={styles.optionContent}>
              {option.image && <HoliLocalImage imageSource={option.image} width={40} height={40} isSvg label={label} />}
              <HoliText style={styles.optionLabel}>{label}</HoliText>
            </View>
            <View style={[styles.optionCheckmark, isSelected && styles.optionCheckmarkSelected]}>
              {isSelected && <HoliIcon icon={Check} size={20} color={colors.background10} />}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

const getStyles = (theme: HoliTheme, windowWidth: number) =>
  StyleSheet.create({
    option: {
      padding: 16,
      backgroundColor: theme.colors.background10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      alignItems: 'center',
    },
    optionContent: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      flexGrow: 1,
      flexShrink: 1,
    },
    optionLabel: {
      flex: 1,
    },
    optionsContainer: {
      display: windowWidth > dimensions.breakpointXl ? 'grid' : 'flex',
      gridTemplateColumns: windowWidth > dimensions.breakpointXl ? '1fr 1fr' : 'none',
      flexDirection: windowWidth > dimensions.breakpointXl ? 'row' : 'column',
      flexWrap: windowWidth > dimensions.breakpointXl ? 'wrap' : 'nowrap',
      justifyContent: 'space-between',
      gap: dimensions.spacingS,
    },
    optionHovered: {
      borderColor: theme.colors.black300,
    },
    optionCheckmark: {
      width: 24,
      height: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionCheckmarkSelected: {
      borderWidth: 0,
      backgroundColor: theme.colors.foreground30,
    },
  })
