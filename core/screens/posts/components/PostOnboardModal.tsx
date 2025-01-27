import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type OnboardingItem = {
  image: StaticImageData
  title: string
  description: string
  width: number
  height: number
}

const onboardingContentList: Array<OnboardingItem> = [
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_create_post_onboarding_step_1.png'),
    title: 'individuals.post.onboarding.slide1.title',
    description: 'individuals.post.onboarding.slide1.description',
    width: 261,
    height: 274,
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_create_post_onboarding_step_2.png'),
    title: 'individuals.post.onboarding.slide2.title',
    description: 'individuals.post.onboarding.slide2.description',
    width: 261,
    height: 274,
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_create_post_onboarding_step_3.png'),
    title: 'individuals.post.onboarding.slide3.title',
    description: 'individuals.post.onboarding.slide3.description',
    width: 266,
    height: 274,
  },
]

interface PostOnboardModalProps {
  visible: boolean
  handleModalClose: () => void
}

const PostOnboardModal = ({ visible, handleModalClose }: PostOnboardModalProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const windowWidth = useWindowDimensions().width
  const styles = useMemo(() => getStyles(windowWidth, theme), [windowWidth, theme])

  return (
    <HoliModal
      shown={visible}
      label={t('individuals.post.onboarding.label')}
      onDismiss={() => handleModalClose()}
      style={styles.modal}
    >
      <HoliModalContentWrapper
        actionButtonText={t('global.gotIt')}
        onActionButtonPress={() => handleModalClose()}
        testID={'post-onboard-content'}
        style={styles.modalContentWrapper}
        headlineAlign="center"
      >
        <HoliCarousel
          marginHorizontal={20}
          slides={onboardingContentList.map((content: OnboardingItem) => ({
            children: (
              <View style={styles.carouselContainer}>
                <HoliText size="extralarge" align="center">
                  {t(content.title)}
                </HoliText>
                <View style={styles.onboardCardContainer}>
                  <HoliLocalImage
                    imageSource={content.image}
                    width={content.width}
                    height={content.height}
                    label={content.description}
                    resizeMode="contain"
                    style={styles.illustration}
                  />
                  <HoliText style={styles.onboardingInstruction} align="center">
                    {t(content.description)}
                  </HoliText>
                </View>
              </View>
            ),
          }))}
        />
      </HoliModalContentWrapper>
    </HoliModal>
  )
}

export default PostOnboardModal

const getStyles = (windowWidth: number, theme: HoliTheme) =>
  StyleSheet.create({
    modalContentWrapper: {
      ...Platform.select({
        web: {
          maxWidth: '100%',
          alignItems: windowWidth > dimensions.breakpointXl ? 'center' : undefined,
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
    illustration: {
      marginBottom: 8,
    },
    onboardCardContainer: {
      marginTop: 24,
      padding: 24,
      borderWidth: 1,
      borderRadius: 16,
      borderColor: theme.colors.foreground30,
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: theme.colors.background20,
      height: '100%',
      flex: 1,
      ...(Platform.OS !== 'web' && { paddingBottom: 8 }),
    },
    onboardingDescription: {
      marginTop: 24,
      textAlign: 'center',
    },
    onboardingInstruction: {
      marginTop: 12,
    },
  })
