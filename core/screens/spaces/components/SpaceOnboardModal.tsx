import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import SpaceOnboardCard from '@holi/core/screens/spaces/components/SpaceOnboardCard'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { breakpoints } from 'holi-bricks/foundations'

export type OnboardSpaceParams = {
  onboarding: string
}

type OnboardingCard = {
  image: StaticImageData
  description: string
  instruction: string
  width: number
  height: number
}

const onboardingContentList: Array<OnboardingCard> = [
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_1.png'),
    description: 'spaces.join.onboarding.slide1.description',
    instruction: '',
    width: 279,
    height: 200,
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_2.png'),
    description: 'spaces.join.onboarding.slide2.description',
    instruction: '',
    width: 279,
    height: 200,
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_3.png'),
    description: 'spaces.join.onboarding.slide3.description',
    instruction: '',
    width: 279,
    height: 200,
  },
]

type SpaceOnboardModalProps = Pick<HoliModalProps, 'shown' | 'onDismiss'>

const SpaceOnboardModal = ({ shown, onDismiss }: SpaceOnboardModalProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const windowWidth = useWindowDimensions().width
  const styles = useMemo(() => getStyles(windowWidth, theme), [windowWidth, theme])

  const OnboardContent = () => {
    return (
      <HoliModalContentWrapper
        actionButtonText={t('spaces.edit.onboarding.modal.close')}
        onActionButtonPress={onDismiss ?? (() => ({}))}
        headlineText={t('spaces.join.onboarding.header')}
        testID={'space-onboard-content'}
        style={styles.modalContentWrapper}
        headlineAlign="center"
      >
        <HoliCarousel
          marginHorizontal={20}
          slides={onboardingContentList.map((content: OnboardingCard) => ({
            children: (
              <View style={styles.carouselContainer}>
                <SpaceOnboardCard content={content} imgWidth={content.width} imgHeight={content.height} />
              </View>
            ),
          }))}
        />
      </HoliModalContentWrapper>
    )
  }

  return (
    <HoliModal
      shown={shown}
      label={t('spaces.edit.onboarding.header')}
      onDismiss={onDismiss}
      style={styles.modal}
      testID="space-chips-modal"
    >
      <OnboardContent />
    </HoliModal>
  )
}

export default SpaceOnboardModal

const getStyles = (windowWidth: number, theme: HoliTheme) =>
  StyleSheet.create({
    modalContentWrapper: {
      ...Platform.select({
        web: {
          maxWidth: '100%',
          alignItems: windowWidth > breakpoints.xl ? 'center' : undefined,
        },
        native: {
          flexShrink: 1,
          height: '100%',
        },
      }),
      backgroundColor: theme.colors.background30,
    },
    modal: {
      backgroundColor: theme.colors.background30,
      height: windowWidth <= breakpoints.xs ? '100%' : windowWidth > breakpoints.xl ? '70%' : '80%',
    },
    carouselContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      flex: 1,
      ...Platform.select({
        web: {
          marginBottom: 54,
          marginTop: 8,
        },
      }),
    },
  })
