import { ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import InfoModal, { type InfoModalItemProps } from '@holi/core/components/InfoModal'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { termsBySortNumberComparator } from '@holi/core/domain/shared/types'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceMainImage from '@holi/core/screens/spaces/components/SpaceMainImage'
import SpaceOnboardCard from '@holi/core/screens/spaces/components/SpaceOnboardCard'
import SpacePublicLink from '@holi/core/screens/spaces/components/SpacePublicLink'
import SpaceSectionEditable from '@holi/core/screens/spaces/components/SpaceSectionEditable'
import EditSpaceAvatar from '@holi/core/screens/spaces/edit/components/EditSpaceAvatar'
import EditSpaceContact from '@holi/core/screens/spaces/edit/components/EditSpaceContact'
import EditSpaceCoverImage from '@holi/core/screens/spaces/edit/components/EditSpaceCoverImage'
import EditSpaceLinks from '@holi/core/screens/spaces/edit/components/EditSpaceLinks'
import EditSpaceLocation from '@holi/core/screens/spaces/edit/components/EditSpaceLocation'
import EditSpaceNameAndGoal from '@holi/core/screens/spaces/edit/components/EditSpaceNameAndGoal'
import EditSpaceSDGs from '@holi/core/screens/spaces/edit/components/EditSpaceSDGs'
import EditSpaceTopics from '@holi/core/screens/spaces/edit/components/EditSpaceTopics'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { At, Close, Edit2, Phone } from '@holi/icons/src/generated'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { constants, dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

enum EditFields {
  NAME = 'NAME',
  TOPICS = 'TOPICS',
  SDGS = 'SDGS',
  COVER_IMAGE = 'COVER_IMAGE',
  AVATAR = 'AVATAR',
  LOCATION = 'LOCATION',
  CONTACT = 'CONTACT',
  LINKS = 'LINKS',
}

const editTitles: Record<EditFields, string> = {
  [EditFields.NAME]: 'spaces.input.nameAndGoal.title',
  [EditFields.TOPICS]: 'spaces.input.topics.title',
  [EditFields.SDGS]: 'spaces.input.sdgs.title',
  [EditFields.COVER_IMAGE]: 'spaces.edit.mainImage',
  [EditFields.AVATAR]: 'spaces.edit.avatar',
  [EditFields.LOCATION]: 'spaces.input.location.title',
  [EditFields.CONTACT]: 'space.input.contact.title',
  [EditFields.LINKS]: 'spaces.input.publicLinks.manage.title',
}

export type EditSpaceParams = {
  spaceIdOrName: string
  onboarding: string
  askOptIn?: string
}

const { useParam } = createParamHooks<EditSpaceParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

type OnboardingCard = {
  image: StaticImageData
  description: string
  width: number
  height: number
}

const onboardingContentList: Array<OnboardingCard> = [
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_onboarding_tip_1.png'),
    description: 'spaces.edit.onboarding.description',
    width: 279,
    height: 200,
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_onboarding_tip_2.png'),
    description: 'spaces.edit.onboarding.tip1',
    width: 279,
    height: 200,
  },
  {
    image: require('@holi/ui/assets/img/illustrations/illustration_space_onboarding_tip_3.png'),
    description: 'spaces.edit.onboarding.tip2',
    width: 279,
    height: 200,
  },
]

export const SDG_INFO_MODAL_SOURCES_MAPPING: {
  [name: string]: InfoModalItemProps
} = {
  sdg: {
    wordmark: {
      src: require('@holi/ui/assets/img/misc/sgd-wordmark.svg'),
      width: 115,
      height: 60,
      isSvg: true,
    },
    url: 'https://sdgs.un.org/goals',
  },
}

const EditSpace: React.FC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [isOnboarding] = useParam('onboarding')
  const [askOptIn] = useParam('askOptIn')

  const [editField, setEditField] = useState<EditFields | null>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const { t } = useTranslation()
  const { navigateBack, replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const statusBarHeight = constants.statusBarHeight
  const windowWidth = useWindowDimensions().width
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(statusBarHeight, windowWidth, theme), [statusBarHeight, windowWidth, theme])

  const { loading, error, space } = useSpace(spaceIdOrName)

  const { visible, show, hide } = useModalState()

  useEffect(() => {
    if (isOnboarding) {
      show()
    }
  }, [show, isOnboarding])

  const { show: showInfoModal, hide: closeInfoModal, visible: infoModalVisible } = useModalState()
  const partner = SDG_INFO_MODAL_SOURCES_MAPPING['sdg']

  const openEditModal = useCallback(
    (type: EditFields) => {
      // if pressed too soon, the state is set to non null, but the modal is not shown.
      // crude mechanism to recover from this state.
      // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
      editField && setEditField(null)
      setIsEdit(true)
      setEditField(type)
      show()
    },
    [editField, setEditField, show]
  )

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTransparent: false,
      headerTitle: () => <HoliText>{t('spaces.edit.title')}</HoliText>,
      headerLeft: () => <HeaderBackButton icon={Close} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [hide, setScreenOptions, show, t, visible])

  if (loading) {
    return <HoliLoader />
  }

  if (error || !space) {
    return <></>
  }

  const sdgs = space.sdgs ? [...space.sdgs].sort(termsBySortNumberComparator) : []

  const handleModalClose = () => {
    if (isOnboarding) {
      // remove onboarding param to avoid going back to onboarding in case user clicks nav-button-back
      replaceRoute(`/spaces/${space.name}/edit`)
    } else {
      setIsEdit(false)
    }
    hide()
  }

  const handleNavigation = () => {
    if (askOptIn === 'true') {
      replaceRoute(`/spaces/${space.name}?askOptIn=true`)
    } else {
      navigateBack()
    }
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.ADMINISTRATOR}
    >
      <SpaceTermContextProvider>
        <ScrollView contentContainerStyle={styles.contentStyle}>
          <View style={styles.wrapper} testID="space-edit-container">
            {/* Header */}
            <View style={styles.header} testID="space-edit-header">
              <SpaceAvatar space={space} testID="space-edit-avatar" />
              <HoliButton
                label={t(`spaces.edit.avatar${space.avatar ? '' : '.add'}`)}
                type="secondary"
                inline
                style={[styles.editButton, styles.editAvatarButton]}
                onPress={() => openEditModal(EditFields.AVATAR)}
                testID="btn-space-edit-avatar"
              >
                <HoliText style={styles.editButtonText}>
                  {t(`spaces.edit.avatar${space.avatar ? '' : '.add'}`)}
                </HoliText>
                <HoliIcon icon={Edit2} />
              </HoliButton>
              <HoliText style={styles.requirements}>{t('spaces.edit.avatar.requirements')}</HoliText>
              <HoliGap />
              <HoliHeading level="1" size="m" testID="space-edit-title">
                {space.title}
              </HoliHeading>
              <HoliButton
                label={t('spaces.edit.title')}
                type="secondary"
                inline
                style={[styles.editButton, styles.editTitleButton]}
                onPress={() => openEditModal(EditFields.NAME)}
                testID="btn-space-edit-name"
              >
                <HoliText style={styles.editButtonText}>{t('global.edit')}</HoliText>
                <HoliIcon icon={Edit2} />
              </HoliButton>
            </View>

            {/* Body */}
            <View style={styles.body}>
              <HoliContainer>
                <SpaceMainImage
                  uri={space.cover}
                  label={space.title}
                  onPress={() => openEditModal(EditFields.COVER_IMAGE)}
                  editable
                />

                <SpaceSectionEditable
                  title={t('spaces.spaceDetails.goal')}
                  style={styles.noBorderSection}
                  onEditPress={() => openEditModal(EditFields.NAME)}
                >
                  {!!space.description && (
                    <HoliRichTextOutput text={space.description} allowAllLinks testID="space-edit-goal" />
                  )}
                </SpaceSectionEditable>

                <SpaceSectionEditable
                  title={t('spaces.spaceDetails.topics')}
                  onEditPress={() => openEditModal(EditFields.TOPICS)}
                  testID="space-edit-topics"
                >
                  {!!space.topics?.length && (
                    <View style={styles.listContainer}>
                      {space.topics?.map((topic, index) => (
                        <ChipLabel key={`topic_${index}`} color="green" testID="space-edit-topics-chip">
                          {topic.title}
                        </ChipLabel>
                      ))}
                    </View>
                  )}
                </SpaceSectionEditable>

                <SpaceSectionEditable
                  title={t('spaces.spaceDetails.location')}
                  onEditPress={() => openEditModal(EditFields.LOCATION)}
                  testID="space-edit-location"
                >
                  {space.location && <HoliText>{space.location}</HoliText>}
                </SpaceSectionEditable>

                <SpaceSectionEditable
                  title={t('spaces.spaceDetails.sdgs')}
                  infoIcon
                  onPressInfo={showInfoModal}
                  onEditPress={() => openEditModal(EditFields.SDGS)}
                  testID="space-edit-sdgs"
                >
                  {!!space.sdgs?.length && (
                    <View style={styles.listContainer}>
                      {sdgs.map((sdg, index) => (
                        <ChipLabel key={`sdg_${index}`} color="white" testID="space-edit-sdgs-chip">
                          {`${sdg.number}. ${sdg.title}`}
                        </ChipLabel>
                      ))}
                    </View>
                  )}
                  <InfoModal
                    items={{ sdg: partner }}
                    show={!!infoModalVisible}
                    onDismiss={closeInfoModal}
                    i18nPrefix={'spaces.input.sdgs.infoModal'}
                  />
                </SpaceSectionEditable>
                <SpaceSectionEditable
                  title={t('spaces.spaceDetails.contact')}
                  onEditPress={() => openEditModal(EditFields.CONTACT)}
                  testID="space-edit-contact"
                >
                  {space.contactDescription || space.contactEmail || space.contactPhone ? (
                    <View>
                      <HoliText>{space.contactDescription}</HoliText>
                      {space.contactEmail && (
                        <View style={styles.contactContainer}>
                          <HoliIcon icon={At} color={colors.foreground20} style={styles.contactIcon} />

                          <HoliText size="small" bold>
                            {space.contactEmail}
                          </HoliText>
                        </View>
                      )}
                      {space.contactPhone && (
                        <View style={styles.contactContainer}>
                          <HoliIcon icon={Phone} color={colors.foreground20} style={styles.contactIcon} />

                          <HoliText size="small" bold>
                            {space.contactPhone}
                          </HoliText>
                        </View>
                      )}
                    </View>
                  ) : null}
                </SpaceSectionEditable>
                <SpaceSectionEditable
                  title={t('spaces.spaceDetails.publicLinks')}
                  onEditPress={() => openEditModal(EditFields.LINKS)}
                  testID="space-edit-links"
                >
                  {!!space.links?.length && (
                    <View style={styles.listContainer}>
                      {space.links.map((link, index) => (
                        <SpacePublicLink key={`link_${index}`} link={link} style={styles.link} />
                      ))}
                    </View>
                  )}
                </SpaceSectionEditable>
              </HoliContainer>
            </View>
          </View>
        </ScrollView>

        <View style={styles.overlayContainer}>
          <HoliButton
            label={t('spaces.edit.close')}
            onPress={handleNavigation}
            style={styles.overlayButton}
            testID="space-edit-close"
          >
            {t('spaces.edit.close')}
          </HoliButton>
        </View>
        <HoliModal
          heading={editField ? t(editTitles[editField]) : ''}
          show={visible}
          autoHeight={!isEdit}
          label={t(isEdit ? 'spaces.edit.title' : 'spaces.edit.onboarding.header')}
          onDismiss={handleModalClose}
          relativeHeight={isEdit ? 1 : undefined}
          headerStyle={isEdit ? styles.modalHeader : styles.onboardingModalHeader}
          testID="space-chips-modal"
          style={isOnboarding && !isEdit ? styles.modal : undefined}
        >
          {isEdit && (
            <>
              {editField === EditFields.NAME && <EditSpaceNameAndGoal space={space} onDismiss={hide} />}
              {editField === EditFields.TOPICS && <EditSpaceTopics space={space} onDismiss={hide} />}
              {editField === EditFields.SDGS && <EditSpaceSDGs space={space} onDismiss={hide} />}
              {editField === EditFields.COVER_IMAGE && <EditSpaceCoverImage space={space} onDismiss={hide} />}
              {editField === EditFields.AVATAR && <EditSpaceAvatar space={space} onDismiss={hide} />}
              {editField === EditFields.LOCATION && <EditSpaceLocation space={space} onDismiss={hide} />}
              {editField === EditFields.CONTACT && <EditSpaceContact space={space} onDismiss={hide} />}
              {editField === EditFields.LINKS && <EditSpaceLinks space={space} onDismiss={hide} />}
            </>
          )}
          {isOnboarding && !isEdit && (
            <HoliModalContentWrapper
              actionButtonText={t('spaces.edit.onboarding.modal.close')}
              onActionButtonPress={handleModalClose}
              headlineText={t('spaces.edit.onboarding.header')}
              testID={'space-onboard-content'}
              headlineAlign="center"
              style={[styles.modalContentWrapper]}
            >
              <HoliCarousel
                style={styles.carouselContainer}
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
          )}
        </HoliModal>
      </SpaceTermContextProvider>
    </PermissionsGuard>
  )
}

const getStyles = (statusBarHeight: number, windowWidth: number, theme: HoliTheme) =>
  StyleSheet.create({
    contentStyle: {
      paddingTop: 16,
      paddingBottom: 0,
    },
    contactIcon: {
      marginRight: 10,
    },
    contactContainer: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    wrapper: {
      justifyContent: 'center',
    },
    modalHeader: {
      backgroundColor: theme.colors.background20,
    },
    onboardingModalHeader: {
      backgroundColor: theme.colors.background30,
    },
    header: {
      alignItems: 'center',
      backgroundColor: theme.colors.background10,
      paddingBottom: 24,
    },
    editButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 2,
    },
    editButtonText: {
      marginRight: 6,
    },
    editAvatarButton: {
      marginVertical: 8,
    },
    editTitleButton: {
      marginTop: 8,
    },
    requirements: {
      color: theme.colors.foreground20,
    },
    container: {
      alignItems: 'center',
    },
    body: {
      backgroundColor: theme.colors.background20,
      paddingTop: 24,
      paddingBottom: 132,
    },
    noBorderSection: {
      borderTopColor: 'transparent',
    },
    listContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexShrink: 1,
      gap: 8,
    },
    chipFontStyle: {
      color: theme.colors.foreground30,
      fontStyle: 'italic',
    },
    link: {
      marginRight: 20,
      marginBottom: 20,
    },
    overlayContainer: {
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      bottom: 42,
      left: 0,
      right: 0,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    overlayButton: {
      marginHorizontal: 'auto',
      maxWidth: dimensions.maxButtonWidth,
    },
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
    modal: {
      backgroundColor: theme.colors.background30,
      height: windowWidth <= dimensions.breakpointXs ? '100%' : windowWidth > dimensions.breakpointXl ? '70%' : '80%',
    },
  })

export default memo(EditSpace)
