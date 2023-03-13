import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import EditSpaceAvatar from '@holi/core/screens/spaces/components/EditSpaceAvatar'
import EditSpaceCoverImage from '@holi/core/screens/spaces/components/EditSpaceCoverImage'
import EditSpaceLocation from '@holi/core/screens/spaces/components/EditSpaceLocation'
import EditSpaceNameAndGoal from '@holi/core/screens/spaces/components/EditSpaceNameAndGoal'
import EditSpaceSDGs from '@holi/core/screens/spaces/components/EditSpaceSDGs'
import EditSpaceTopics from '@holi/core/screens/spaces/components/EditSpaceTopics'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceMainImage from '@holi/core/screens/spaces/components/SpaceMainImage'
import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceSocialLink from '@holi/core/screens/spaces/components/SpaceSocialLink'
import SpaceTermContextProvider from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType, SpaceLinkVisibility } from '@holi/core/screens/spaces/types'
import { termsBySortNumberComparator } from '@holi/core/screens/userprofile/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

enum EditFields {
  NAME = 'NAME',
  TOPICS = 'TOPICS',
  SDGS = 'SDGS',
  COVER_IMAGE = 'COVER_IMAGE',
  AVATAR = 'AVATAR',
  LOCATION = 'LOCATION',
}

export type EditSpaceParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<EditSpaceParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const EditSpace: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [editField, setEditField] = useState<EditFields | null>(null)

  const { t } = useTranslation()
  const { setOptions } = useUnifiedNavigation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  if (!loading && !isAdmin) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  const { visible, show, hide } = useModalState()

  const openEditModal = useCallback(
    (type: EditFields) => {
      setEditField(type)
      show()
    },
    [setEditField, show]
  )

  useLayoutEffect(() => {
    setOptions({
      animation: 'slide_from_bottom',
      headerTitle: () => <HoliText>{t('spaces.edit.title')}</HoliText>,
      headerLeft: () => <HeaderBackButton icon="close" />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [hide, setOptions, show, space?.id, t, visible])

  if (error) {
    logError(error, `[EditSpace.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space || !isAdmin) {
    return <></>
  }

  const sdgs = space.sdgs ? [...space.sdgs].sort(termsBySortNumberComparator) : []

  return (
    <SpaceTermContextProvider>
      <DefaultScrollHeaderLayout style={styles.defaultLayout} contentStyle={styles.contentStyle}>
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
              <HoliText style={styles.editButtonText}>{t(`spaces.edit.avatar${space.avatar ? '' : '.add'}`)}</HoliText>
              <HoliIcon icon="edit-2" />
            </HoliButton>
            <HoliText style={styles.requirements}>{t('spaces.edit.avatar.requirements')}</HoliText>
            <HoliHeading level="1" size="medium" style={styles.title} testID="space-edit-title">
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
              <HoliIcon icon="edit-2" />
            </HoliButton>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <View style={mixins.container}>
              <SpaceMainImage
                uri={space.cover}
                label={space.title}
                onPress={() => openEditModal(EditFields.COVER_IMAGE)}
                editable
              />

              <SpaceSection
                title={t('spaces.spaceDetails.goal')}
                editable
                style={styles.noBorderSection}
                onPressEdit={() => openEditModal(EditFields.NAME)}
                testID="space-edit-goal"
              >
                {!!space.description && <HoliText>{space.description}</HoliText>}
              </SpaceSection>

              <SpaceSection
                title={t('spaces.spaceDetails.topics')}
                editable
                onPressEdit={() => openEditModal(EditFields.TOPICS)}
                testID="space-edit-topics"
              >
                {!!space.topics?.length && (
                  <View style={styles.listContainer}>
                    {space.topics?.map((topic, index) => (
                      <HoliChip
                        key={`topic_${index}`}
                        text={topic.title}
                        label={topic.title}
                        disabled
                        style={styles.chip}
                        testID="space-edit-topics-chip"
                      />
                    ))}
                  </View>
                )}
              </SpaceSection>

              <SpaceSection
                title={t('spaces.spaceDetails.location')}
                editable
                onPressEdit={() => openEditModal(EditFields.LOCATION)}
              >
                {space.location && <HoliText>{space.location}</HoliText>}
              </SpaceSection>

              <SpaceSection
                title={t('spaces.spaceDetails.sdgs')}
                editable
                onPressEdit={() => openEditModal(EditFields.SDGS)}
                testID="space-edit-sdgs"
              >
                {!!space.sdgs?.length && (
                  <View style={styles.listContainer}>
                    {sdgs.map((sdg, index) => (
                      <HoliChip
                        key={`sdg_${index}`}
                        text={`${sdg.number}. ${sdg.title}`}
                        label={`${sdg.number}. ${sdg.title}`}
                        disabled
                        style={styles.chip}
                        testID="space-edit-sdgs-chip"
                      />
                    ))}
                  </View>
                )}
              </SpaceSection>

              <SpaceSection title={t('spaces.links.heading')} editable>
                {!!space.links?.length && (
                  <View style={styles.listContainer}>
                    {space.links
                      .filter((link) => link.visibility === SpaceLinkVisibility.PUBLIC)
                      .map((link, index) => (
                        <SpaceSocialLink key={`link_${index}`} link={link} style={styles.link} />
                      ))}
                  </View>
                )}
              </SpaceSection>
            </View>
          </View>
        </View>
      </DefaultScrollHeaderLayout>

      <View style={styles.overlayContainer}>
        <HoliButton
          label={t('spaces.edit.close')}
          onPress={() => navigate(`/spaces/${spaceIdOrName}`)}
          style={styles.overlayButton}
          testID="space-edit-close"
        >
          {t('spaces.edit.close')}
        </HoliButton>
      </View>
      <HoliModal
        show={visible}
        label={t('spaces.edit.title')}
        onDismiss={hide}
        relativeHeight={1}
        autoHeight={false}
        headerStyle={styles.modalHeader}
      >
        {editField === EditFields.NAME && <EditSpaceNameAndGoal space={space} onDismiss={hide} />}
        {editField === EditFields.TOPICS && <EditSpaceTopics space={space} onDismiss={hide} />}
        {editField === EditFields.SDGS && <EditSpaceSDGs space={space} onDismiss={hide} />}
        {editField === EditFields.COVER_IMAGE && <EditSpaceCoverImage space={space} onDismiss={hide} />}
        {editField === EditFields.AVATAR && <EditSpaceAvatar space={space} onDismiss={hide} />}
        {editField === EditFields.LOCATION && <EditSpaceLocation space={space} onDismiss={hide} />}
      </HoliModal>
    </SpaceTermContextProvider>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 8,
  },
  contentStyle: {
    paddingBottom: 0,
  },
  wrapper: {
    justifyContent: 'center',
    paddingTop: 12,
  },
  modalHeader: {
    backgroundColor: colors.background30,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.background10,
    paddingBottom: 24,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    color: colors.foreground20,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    paddingTop: 24,
  },
  body: {
    backgroundColor: colors.background20,
    paddingTop: 24,
    paddingBottom: 72,
  },
  noBorderSection: {
    borderTopColor: 'transparent',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  chip: {
    backgroundColor: colors.background10,
    marginRight: 8,
    marginBottom: 8,
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
    maxWidth: vars.maxButtonWidth,
  },
})

export default memo(EditSpace)
