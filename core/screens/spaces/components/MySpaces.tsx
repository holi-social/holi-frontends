import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { SpaceSection } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { colors } from '@holi/ui/styles/globalVars'

export type MySpacesProps = {
  mySpaces: SpaceSection[]
  style?: StyleProp<ViewStyle>
}
const MySpaces: React.VFC<MySpacesProps> = ({ mySpaces = [], style }) => {
  const { t } = useTranslation()
  const { visible, show, hide } = useModalState()

  useEffect(() => {
    show()
  }, [show])

  // FIXME: this will be very expensive when spaces start growing.
  // If we need a better API this should be changed on the backend.
  const mappedSpaces = mySpaces.map((section) => {
    return {
      title: section.section,
      type: section.type,
      data: section.spaces.data,
    }
  })

  type OnboardingCard = {
    image: StaticImageData
    description: string
    instruction: string
  }

  const onboardingContentList: Array<OnboardingCard> = [
    {
      image: require('@holi/ui/assets/img/illustrations/illustration_space_onboarding_tip_1.svg'),
      description: 'spaces.join.onboarding.slide1.description',
      instruction: 'spaces.edit.onboarding.instruction',
    },
    {
      image: require('@holi/ui/assets/img/illustrations/illustration_space_onboarding_tip_2.svg'),
      description: 'spaces.join.onboarding.slide2.description',
      instruction: '',
    },
    {
      image: require('@holi/ui/assets/img/illustrations/illustration_space_onboarding_tip_3.svg'),
      description: 'spaces.join.onboarding.slide3.description',
      instruction: '',
    },
  ]

  type OnboardCardProps = {
    content: OnboardingCard
  }
  const handleOnboardingModalClose = () => {
    hide()
  }

  const handleModalClose = () => {
    hide()
  }

  const OnboardCard = ({ content }: OnboardCardProps) => {
    return (
      <View style={styles.onboardCardContainer}>
        <HoliLocalImage
          imageSource={content.image}
          width={279}
          height={200}
          label={''}
          isSvg={true}
          resizeMode="contain"
          style={styles.illustration}
        />
        <HoliText style={styles.onboardingDescription}>{t(content.description)}</HoliText>
        <HoliText bold style={styles.onboardingInstruction}>
          {t(content.instruction)}
        </HoliText>
      </View>
    )
  }

  const OnboardContent = () => {
    return (
      <HoliModalContentWrapper
        actionButtonText={t('spaces.edit.onboarding.modal.close')}
        onActionButtonPress={() => handleOnboardingModalClose()}
        headlineText={t('spaces.join.onboarding.header')}
        testID={'space-onBoard-content'}
        style={[styles.modalContentWrapper]}
      >
        <HoliCarousel
          marginHorizontal={20}
          slides={onboardingContentList.map((content: OnboardingCard) => ({
            children: (
              <View style={styles.carouselContainer}>
                <OnboardCard content={content} />
              </View>
            ),
          }))}
        />
      </HoliModalContentWrapper>
    )
  }

  return (
    <View style={[styles.mySpaces, style]}>
      {mappedSpaces.map((section, sectionIndex) => (
        <View key={`${sectionIndex}`} style={styles.section}>
          <HoliHeading level="3" size="small" testID={`section-headline-${section.type}`}>
            {section.title}
          </HoliHeading>

          {section.data.map((space) => (
            <View key={`${sectionIndex}-${space.name}`} style={styles.spaceItemContainer}>
              <HoliBlockItem
                label={space.title}
                title={space.title}
                subtitle={space.location}
                description={space.description}
                imageElement={<SpaceAvatar space={space} size="large" />}
                users={space.members.data.map((membership) => membership.user)}
                href={decodeURI(`/spaces/${space.name}`)}
                testID="space-link"
              />
            </View>
          ))}
        </View>
      ))}
      <HoliModal
        show={visible}
        label={t('spaces.edit.onboarding.header')}
        onDismiss={() => handleModalClose()}
        autoHeight={true}
        headerStyle={styles.modalHeader}
        testID="space-chips-modal"
      >
        <OnboardContent />
      </HoliModal>
    </View>
  )
}

export default MySpaces

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background20,
    flex: 1,
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    }),
  },
  mySpaces: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  spaceItemContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    alignItems: 'center',
  },
  optionsButton: {
    display: 'flex',
    marginRight: 4,
    backgroundColor: colors.background10,
    padding: 6,
    borderRadius: 8,
  },

  // Onboarding
  onboardCardContainer: {
    padding: 24,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.foreground30,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: colors.background20,
    height: '81%',
  },
  illustration: {
    marginBottom: 8,
  },
  onboardingDescription: {
    marginTop: 24,
    textAlign: 'center',
  },
  onboardingInstruction: {
    marginTop: 12,
  },
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
    backgroundColor: colors.background30,
  },
  carouselContainer: {
    width: '100%',
    marginBottom: Platform.OS === 'web' ? 54 : 0,
  },
  modalHeader: {
    backgroundColor: colors.background30,
  },
})
