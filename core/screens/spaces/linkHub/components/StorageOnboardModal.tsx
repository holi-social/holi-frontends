import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type OnboardStorageParams = {
  onboarding: string
}

type OnboardingCard = {
  image: StaticImageData
  description: string
  instruction: string
  width: number
  height: number
}

const onboardingContent: OnboardingCard = {
  image: require('@holi/ui/assets/img/illustrations/storage_onboarding_composition.svg'),
  description: 'spaces.join.onboarding.slide1.description',
  instruction: 'spaces.edit.onboarding.instruction',
  width: 327,
  height: 211,
}

interface StorageOnboardModalProps {
  visible: boolean
  handleModalClose: () => void
}

const StorageOnboardModal = ({ visible, handleModalClose }: StorageOnboardModalProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const OnboardContent = () => {
    return (
      <HoliModalContentWrapper
        actionButtonText={t('spaces.storage.onboarding.button')}
        onActionButtonPress={() => handleModalClose()}
        headlineText={t('spaces.storage.onboarding.title')}
        headlineAlign="center"
        testID={'space-onboard-content'}
        style={styles.modalContentWrapper}
      >
        <View style={styles.onboardCardContainer}>
          <HoliText style={styles.hint1}>{t('spaces.storage.onboarding.hint1')}</HoliText>
          <HoliLocalImage
            imageSource={onboardingContent.image}
            width={onboardingContent.width}
            height={onboardingContent.height}
            label={''}
            isSvg={true}
            resizeMode="contain"
            style={styles.illustration}
          />
          <HoliText style={styles.hint2}>{t('spaces.storage.onboarding.hint2')}</HoliText>
        </View>
      </HoliModalContentWrapper>
    )
  }

  return (
    <HoliModal
      show={visible}
      label={t('spaces.storage.onboarding.title')}
      onDismiss={() => handleModalClose()}
      style={styles.modal}
    >
      <OnboardContent />
    </HoliModal>
  )
}

export default StorageOnboardModal

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.colors.background30,
    },
    illustration: {
      marginVertical: 16,
    },
    onboardCardContainer: {
      paddingHorizontal: 24,
      paddingTop: 0,
      alignItems: 'center',
      alignContent: 'center',
      height: '100%',
      flex: 1,
    },
    hint1: {
      textAlign: 'center',
      marginBottom: 16,
      color: theme.colors.foreground20,
    },
    hint2: {
      marginTop: 24,
      textAlign: 'center',
    },
  })
