import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceOnboardCard from '@holi/core/screens/spaces/components/SpaceOnboardCard'
import { useSpaceOnboarding } from '@holi/core/screens/spaces/helpers/hooks'
import { SpaceSection } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { colors } from '@holi/ui/styles/globalVars'

export type MySpacesProps = {
  mySpaces: SpaceSection[]
  style?: StyleProp<ViewStyle>
}

export type OnboardSpaceParams = {
  onboarding: string
}

type OnboardingCard = {
  image: StaticImageData
  description: string
  instruction: string
}

const onboardingContentList: Array<OnboardingCard> = [
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_1.svg'),
    description: 'spaces.join.onboarding.slide1.description',
    instruction: 'spaces.edit.onboarding.instruction',
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_2.svg'),
    description: 'spaces.join.onboarding.slide2.description',
    instruction: '',
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_join_onboarding_step_3.svg'),
    description: 'spaces.join.onboarding.slide3.description',
    instruction: '',
  },
]

const MySpaces: React.VFC<MySpacesProps> = ({ mySpaces = [], style }) => {
  const { t } = useTranslation()
  const { visible, show, hide } = useModalState()

  const { isOnboarded, setIsOnboarded } = useSpaceOnboarding('space_join_is_onboarded')

  useEffect(() => {
    const mySpacesList = mySpaces.flatMap((section) => section.spaces.data)

    if (
      !isOnboarded &&
      mySpacesList.some((space) => !space.connectionStatusToMyself.includes(SpaceConnectionType.CREATOR))
    ) {
      show()
    }
  }, [mySpaces, show, isOnboarded])

  // FIXME: this will be very expensive when spaces start growing.
  // If we need a better API this should be changed on the backend.
  const mappedSpaces = mySpaces.map((section) => {
    return {
      title: section.section,
      type: section.type,
      data: section.spaces.data,
    }
  })

  const handleModalClose = () => {
    setIsOnboarded()
    hide()
  }

  const OnboardContent = () => {
    return (
      <HoliModalContentWrapper
        actionButtonText={t('spaces.edit.onboarding.modal.close')}
        onActionButtonPress={() => handleModalClose()}
        headlineText={t('spaces.join.onboarding.header')}
        testID={'space-onBoard-content'}
        style={styles.modalContentWrapper}
      >
        <HoliCarousel
          marginHorizontal={20}
          slides={onboardingContentList.map((content: OnboardingCard) => ({
            children: (
              <View style={styles.carouselContainer}>
                <SpaceOnboardCard content={content} />
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
                type={section.type}
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
        headerStyle={styles.modalHeader}
        style={styles.modal}
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
    display: 'flex',
    flex: 1,
    marginBottom: Platform.OS === 'web' ? 54 : 0,
  },
  modal: {
    height: '75%',
  },
  modalHeader: {
    backgroundColor: colors.background30,
  },
})
