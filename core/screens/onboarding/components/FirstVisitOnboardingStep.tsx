import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import {
  FirstVisitOnboardingSelection,
  FirstVisitOnboardingSelectionOption,
} from '@holi/core/screens/onboarding/components/FirstVisitOnboardingSelection'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { dimensions } from '@holi/ui/styles/globalVars'

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
  const { width: screenWidth } = useClientWindowDimensions()
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
      {options.length > 0 ? (
        <>
          <HoliGap size="ml" />
          <FirstVisitOnboardingSelection
            step={step}
            options={options}
            initialSelection={initialSelection}
            onSelect={onSelect}
          />
        </>
      ) : null}
    </HoliContainer>
  )
}
