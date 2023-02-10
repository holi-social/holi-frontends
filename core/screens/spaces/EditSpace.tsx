import { useMutation, useQuery } from '@apollo/client'
import React, { memo, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { extractFieldErrors, logError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceMainImage from '@holi/core/screens/spaces/components/SpaceMainImage'
import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceSocialLink from '@holi/core/screens/spaces/components/SpaceSocialLink'
import {
  SpaceByIdResponse,
  UpdateSpaceInput,
  UpdateSpaceInputSchema,
  UpdateSpaceResponse,
  spaceByIdQuery,
  updateSpaceMutation,
} from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type EditSpaceParams = {
  spaceId: string
}

const { useParam } = createParam<EditSpaceParams>()

type ScreenProps = NativeStackScreenProps<BottomTabsScreens>

const EditSpace: React.VFC<ScreenProps> = () => {
  const [spaceId] = useParam('spaceId')

  const { t, i18n } = useTranslation()
  const onScreenScroll = useScrollYHandler()
  const { setOptions } = useUnifiedNavigation()
  const { width: deviceWidth } = useWindowDimensions()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const { openToast } = useToast()

  const avatarWidth = deviceWidth / 5 // make avatar responsive (SpaceAvatar has a maxWidth)

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { id: spaceId },
  })
  const [updateSpace] = useMutation<UpdateSpaceResponse>(updateSpaceMutation)

  const handleUpdate = useCallback(
    async (input: UpdateSpaceInput) => {
      const resultSchema = UpdateSpaceInputSchema.safeParse(input)
      if (!resultSchema.success) {
        // TODO: setFieldErrors(resultSchema.error.flatten().fieldErrors)
        return
      }
      await updateSpace({
        variables: {
          input: {
            ...input,
            id: spaceId,
          },
        },
        refetchQueries: [{ query: spaceByIdQuery, variables: { id: spaceId } }],
        onCompleted: () => openToast(t('spaces.edit.success'), HoliToastType.SUCCESS),
        onError: (error) => {
          const errors = extractFieldErrors(error)
          // TODO: setFieldErrors
          if (errors && errors.avatar) {
            const avatarError = errors.avatar[0]
            const messageKey = `spaces.edit.avatar.error.${avatarError.code}`
            openToast(i18n.exists(messageKey) ? t(messageKey) : avatarError.message, HoliToastType.ERROR)
          } else {
            openToast(error?.message || t('global.technicalError'), HoliToastType.ERROR)
          }
        },
      })
    },
    [updateSpace, spaceId, openToast, t, i18n]
  )

  const space = data?.spaceById

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  if (!loading && !isAdmin) {
    navigate(`/spaces/${spaceId}`)
  }

  const { visible, show, hide } = useModalState()

  const handleAvatarUpload = useCallback((image) => image?.blob && handleUpdate({ avatar: image.blob }), [handleUpdate])

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

  return (
    <>
      <DefaultLayout
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
      >
        <View style={styles.wrapper} testID="space-edit-container">
          {/* Header */}
          <View style={styles.header} testID="space-edit-header">
            <SpaceAvatar label={space.title} imageSrc={space.avatar} width={avatarWidth} testID="space-edit-avatar" />
            <HoliImagePicker
              buttonProps={{
                label: t(`spaces.edit.avatar${space.avatar ? '' : '.add'}`),
                type: 'secondary',
                inline: true,
                style: [styles.editButton, styles.editAvatarButton],
              }}
              onPickImage={handleAvatarUpload}
              maxFileSizeInMB={8}
            >
              <HoliText style={styles.editButtonText}>{t(`spaces.edit.avatar${space.avatar ? '' : '.add'}`)}</HoliText>
              <HoliIcon icon="edit-2" />
            </HoliImagePicker>
            <HoliText style={styles.requirements}>{t('spaces.edit.avatar.requirements')}</HoliText>
            <HoliHeading level="1" size="medium" style={styles.title} testID="space-edit-title">
              {space.title}
            </HoliHeading>
            <HoliButton
              label={t(`spaces.edit.avatar${space.avatar ? '' : '.add'}`)}
              type="secondary"
              inline
              style={[styles.editButton, styles.editTitleButton]}
            >
              <HoliText style={styles.editButtonText}>{t('global.edit')}</HoliText>
              <HoliIcon icon="edit-2" />
            </HoliButton>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <View style={mixins.container}>
              <SpaceMainImage uri={space.mainImage} label={space.title} editable />

              <SpaceSection title={t('spaces.spaceDetails.location')} editable style={styles.noBorderSection}>
                {space.location && <HoliText>{space.location}</HoliText>}
              </SpaceSection>

              <SpaceSection title={t('spaces.spaceDetails.topics')} editable>
                {!!space.topics?.length && (
                  <View style={styles.listContainer}>
                    {space.topics?.map((topic, index) => (
                      <HoliChip
                        key={`topic_${index}`}
                        text={topic.title}
                        label={topic.title}
                        disabled
                        style={styles.chip}
                      />
                    ))}
                  </View>
                )}
              </SpaceSection>

              <SpaceSection title={t('spaces.links.heading')} editable>
                {!!space.links?.length && (
                  <View style={styles.listContainer}>
                    {space.links.map((link, index) => (
                      <SpaceSocialLink key={`link_${index}`} link={link} style={styles.link} />
                    ))}
                  </View>
                )}
              </SpaceSection>
            </View>
          </View>
        </View>
      </DefaultLayout>
      <View style={styles.overlayContainer}>
        <HoliButton
          label={t('spaces.edit.close')}
          onPress={() => navigate(`/spaces/${spaceId}`)}
          style={styles.overlayButton}
        >
          {t('spaces.edit.close')}
        </HoliButton>
      </View>
    </>
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
  header: {
    alignItems: 'center',
    backgroundColor: colors.backgroundColorWhite,
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
    color: colors.fontColorGrey,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    paddingTop: 24,
  },
  body: {
    backgroundColor: colors.backgroundColorGrey,
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
    backgroundColor: colors.backgroundColor,
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
