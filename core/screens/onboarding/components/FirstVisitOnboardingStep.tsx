import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
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

export interface FirstVisitOnboardingStepProps {
  options?: FirstVisitOnboardingSelectionOption[]
  initialSelection?: string
  onSelect: (selection: string) => void
  step: string
  descriptionAbove?: boolean
  image?: {
    source: StaticImageData
    width: number
    height: number
  }
}

interface FirstTimeOnboardingSelectionProps {
  options: FirstVisitOnboardingSelectionOption[]
  initialSelection?: string
  onSelect: (selection: string) => void
  step: string
}

const FirstVisitOnboardingSelection = ({
  options = [],
  initialSelection,
  onSelect,
  step,
}: FirstTimeOnboardingSelectionProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const windowWidth = Dimensions.get('window').width
  const styles = useMemo(() => getStyles(theme, windowWidth), [theme, windowWidth])
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
    <>
      <HoliGap size="ml" />
      <View style={styles.optionsContainer}>
        {visibleOptions.map((option) => {
          const isSelected = option.id === selectedOption
          const label = t(`onboarding.firstVisit.${step}.option.${option.id}`)
          return (
            <Pressable
              key={option.id}
              style={({ hovered }) => [styles.option, (hovered || isSelected) && styles.optionHovered]}
              onPress={() => onSelectOption(option.id)}
            >
              <View style={styles.optionContent}>
                {option.image && (
                  <HoliLocalImage imageSource={option.image} width={40} height={40} isSvg label={label} />
                )}
                <HoliText style={styles.optionLabel}>{label}</HoliText>
              </View>
              <View style={[styles.optionCheckmark, isSelected && styles.optionCheckmarkSelected]}>
                {isSelected && <HoliIcon icon={Check} size={20} color={colors.background10} />}
              </View>
            </Pressable>
          )
        })}
      </View>
    </>
  )
}

const FirstVisitOnboardingStepHeader = ({
  step,
  descriptionAbove = false,
}: Pick<FirstVisitOnboardingStepProps, 'step' | 'descriptionAbove'>) => {
  const { t } = useTranslation()

  if (descriptionAbove) {
    return (
      <>
        <HoliGap size="s" />
        <HoliText>{t(`onboarding.firstVisit.${step}.description`)}</HoliText>
        <HoliGap size="s" />
        <HoliHeading size="l" weight="400">
          {t(`onboarding.firstVisit.${step}.heading`)}
        </HoliHeading>
      </>
    )
  }

  return (
    <>
      <HoliGap size="sm" />
      <HoliHeading>{t(`onboarding.firstVisit.${step}.heading`)}</HoliHeading>
      <HoliGap size="s" />
      <HoliText>{t(`onboarding.firstVisit.${step}.description`)}</HoliText>
    </>
  )
}

export const FirstVisitOnboardingStep = ({
  options = [],
  descriptionAbove = false,
  initialSelection,
  onSelect,
  step,
  image,
}: FirstVisitOnboardingStepProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const maxImageWidth = screenWidth - dimensions.spacingML * 2
  const imageAspectRatio = image ? image.height / image.width : 1
  const maxImageHeight = imageAspectRatio * maxImageWidth

  return (
    <HoliContainer>
      <HoliGap size="s" />
      <FirstVisitOnboardingStepHeader step={step} descriptionAbove={descriptionAbove} />
      {image ? (
        <>
          <HoliGap size="ml" />
          <HoliLocalImage
            imageSource={image.source}
            label=""
            resizeMode="cover"
            style={{ alignItems: 'center' }}
            width={
              Platform.OS === 'web' && screenWidth < dimensions.breakpointM
                ? maxImageWidth
                : Math.min(maxImageWidth, image.width)
            }
            height={
              Platform.OS === 'web' && screenWidth < dimensions.breakpointM
                ? maxImageHeight
                : Math.min(maxImageHeight, image.height)
            }
          />
        </>
      ) : null}
      <FirstVisitOnboardingSelection
        step={step}
        options={options}
        initialSelection={initialSelection}
        onSelect={onSelect}
      />
    </HoliContainer>
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
