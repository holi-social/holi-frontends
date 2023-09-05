import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import SpaceOnboardCard from '@holi/core/screens/spaces/components/SpaceOnboardCard'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { colors } from '@holi/ui/styles/globalVars'

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
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_1.svg'),
    description: 'spaces.join.onboarding.slide1.description',
    instruction: 'spaces.edit.onboarding.instruction',
    width: 279,
    height: 200,
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_2.svg'),
    description: 'spaces.join.onboarding.slide2.description',
    instruction: '',
    width: 279,
    height: 200,
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_3.svg'),
    description: 'spaces.join.onboarding.slide3.description',
    instruction: '',
    width: 279,
    height: 200,
  },
]

interface SpaceOnboardModalProps {
  visible: boolean
  handleModalClose: () => void
}

const SpaceOnboardModal = ({ visible, handleModalClose }: SpaceOnboardModalProps) => {
  const { t } = useTranslation()

  const OnboardContent = () => {
    return (
      <HoliModalContentWrapper
        actionButtonText={t('spaces.edit.onboarding.modal.close')}
        onActionButtonPress={() => handleModalClose()}
        headlineText={t('spaces.join.onboarding.header')}
        testID={'space-onboard-content'}
        style={styles.modalContentWrapper}
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
      show={visible}
      label={t('spaces.edit.onboarding.header')}
      onDismiss={() => handleModalClose()}
      style={styles.modal}
      testID="space-chips-modal"
    >
      <OnboardContent />
    </HoliModal>
  )
}

export default SpaceOnboardModal

const styles = StyleSheet.create({
  modalContentWrapper: {
    ...Platform.select({
      web: {
        maxWidth: '100%',
      },
      native: {
        flexShrink: 1,
        height: '100%',
      },
    }),
  },
  modal: {
    backgroundColor: colors.background30,
    height: Platform.OS === 'web' ? '100%' : '75%',
  },
  carouselContainer: {
    width: '100%',
    display: 'flex',
    flex: 1,
    marginBottom: Platform.OS === 'web' ? 54 : 0,
  },
})
