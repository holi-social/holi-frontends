import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { useAtomValue } from 'jotai'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { SpaceChatTab, spaceNotificationCountRecordAtom, spaceTabRecordAtom } from '@holi/chat/src/store'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import useDeleteSpace from '@holi/core/hooks/spaces/useDeleteSpace'
import { useLeaveSpace } from '@holi/core/hooks/spaces/useLeaveSpace'
import useReportContent from '@holi/core/hooks/useReportContent'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ContentType } from '@holi/core/queries'
import SpaceOnboardModal from '@holi/core/screens/spaces/components/SpaceOnboardModal'
import AddNewDrawer from '@holi/core/screens/spaces/details/components/AddNewDrawer'
import SpaceDetailView from '@holi/core/screens/spaces/details/components/SpaceDetailView'
import SpaceShareIcon from '@holi/core/screens/spaces/details/components/SpaceShareIcon'
import { useSpaceOnboarding } from '@holi/core/screens/spaces/helpers/hooks'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Delete, DoorClosed, Edit2, Flag, Pencil, UserSettings } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceDetailsParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceDetailsParams>()

const SpaceDetails = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>()

  const { t } = useTranslation()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, +vars.maxScreenWidth) / 2
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)

  // On initial page load on web `spaceIdOrName` is undefined
  // > will probably be solved with ssr
  // see https://github.com/nandorojo/solito/issues/100
  const { loading, error, data, refetch } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName || '' },
    fetchPolicy: 'cache-and-network', // ensures that all required fields are eventually present
    skip: !spaceIdOrName,
    onError: (error) =>
      !isNotFoundError(error) &&
      logError(error, 'Failed to load space', { location: 'SpaceDetails.spaceByIdQuery', spaceIdOrName }),
  })
  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const isWeb = Platform.OS === 'web'
  const space = data?.spaceById
  const id = space?.id || `${spaceIdOrName}`

  const [isLoading, deleteSpace] = useDeleteSpace(id)
  const [isLoadingReport, reportContent] = useReportContent({
    id,
    contentType: ContentType.SPACE,
    successMsg: t('global.report.successMessage'),
  })

  const {
    confirmationTitle,
    confirmationDescription,
    isLoadingLeaveSpace,
    dismissLeaveSpaceButton,
    confirmLeaveSpaceText,
    leaveSpaceAction,
  } = useLeaveSpace(space)

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const { isOnboarded, setIsOnboarded } = useSpaceOnboarding('space_join_is_onboarded')
  const { visible, show, hide } = useModalState()
  const { userId } = useAuth()

  const isCreator = space?.creator?.id === userId

  useEffect(() => {
    if (!isOnboarded && !isCreator && isMember) {
      show()
    }
  }, [space, show, isOnboarded, userId, isCreator, isMember])

  const handleModalClose = () => {
    setIsOnboarded().finally(hide)
  }

  const editAction = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/edit`)
  }, [navigate, spaceIdOrName])

  const deleteConfirmationAction = useCallback(() => {
    navigate('/spaces')
    deleteSpace()
  }, [deleteSpace, navigate])

  const manageCollaboratorsAction = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/collaborators`)
  }, [navigate, spaceIdOrName])

  const renderActionDrawer = useCallback(
    () => (
      <>
        <HoliActionDrawer.Drawer label={t('global.moreOptions')} testID="space-options-btn" variant="dark">
          {isAdmin && (
            <>
              <HoliActionDrawer.Action
                isLoading={isLoading}
                icon={Edit2}
                title={t('global.edit')}
                handleAction={editAction}
              />
              <HoliActionDrawer.Action
                isLoading={isLoading}
                icon={UserSettings}
                title={t('spaces.collaborators.manage.modal.title')}
                handleAction={manageCollaboratorsAction}
              />
            </>
          )}
          {isMember && (
            <HoliActionDrawer.Action
              isLoading={isLoadingLeaveSpace}
              icon={DoorClosed}
              title={t('spaces.spaceDetails.leave')}
              showConfirmation
            >
              <HoliActionDrawer.Confirmation
                title={confirmationTitle}
                description={confirmationDescription}
                testID="space-leave"
                handleConfirmation={leaveSpaceAction}
                hasDismissBtn={dismissLeaveSpaceButton.show}
                dismissText={dismissLeaveSpaceButton.text}
                confirmText={confirmLeaveSpaceText}
                requireLogin
              />
            </HoliActionDrawer.Action>
          )}

          <HoliActionDrawer.Action isLoading={isLoadingReport} icon={Flag} title={t('global.report')} showConfirmation>
            <HoliActionDrawer.Confirmation
              title={t('spaces.spaceDetails.report.confirmation.title')}
              description={t('spaces.spaceDetails.report.confirmation.description')}
              testID="space-report"
              handleConfirmation={reportContent}
              hasDismissBtn
              requireLogin
            />
          </HoliActionDrawer.Action>

          {isAdmin && (
            <HoliActionDrawer.Action
              isLoading={isLoading}
              icon={Delete}
              title={t('global.delete')}
              variant="danger"
              showConfirmation
              testID="space-delete"
            >
              <HoliActionDrawer.Confirmation
                title={t('spaces.delete.confirmation.title')}
                description={t('spaces.delete.confirmation.description')}
                testID="space-delete"
                handleConfirmation={deleteConfirmationAction}
                hasDismissBtn
                requireLogin
              />
            </HoliActionDrawer.Action>
          )}
        </HoliActionDrawer.Drawer>
      </>
    ),
    [
      reportContent,
      deleteConfirmationAction,
      leaveSpaceAction,
      editAction,
      isMember,
      manageCollaboratorsAction,
      isAdmin,
      t,
      isLoadingReport,
      isLoading,
      confirmationDescription,
      confirmationTitle,
      isLoadingLeaveSpace,
      confirmLeaveSpaceText,
      dismissLeaveSpaceButton.show,
      dismissLeaveSpaceButton.text,
    ]
  )

  const spaceTabRooms: SpaceChatTab[] = Object.values(useAtomValue(spaceTabRecordAtom))
  const spaceGeneralTabRoom: SpaceChatTab | undefined = spaceTabRooms.find(({ content }) => content.holiSpaceId === id)
  const spaceRelatedNotificationCountRecord = useAtomValue(spaceNotificationCountRecordAtom)
  const spaceNotificationCount = spaceGeneralTabRoom ? spaceRelatedNotificationCountRecord[spaceGeneralTabRoom.id] : 0

  useEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTintColor: colors.foreground30,
      headerTitle: () => null,
      headerLeft: () => <HeaderBackButton />,
      headerRight: (props) => (
        <View style={styles.headerRight}>
          {(isMember || isAdmin) && spaceGeneralTabRoom && (
            <HoliButtonBell
              label={t('spaces.actions.chat', { spaceNmae: space?.name })}
              icon={Chat3}
              showBell={spaceNotificationCount > 0}
              onPress={() => {
                navigate(`/chat?activeTab=${spaceGeneralTabRoom.id}`)
              }}
              color={props.tintColor}
            />
          )}
          {!isMember || !isAdmin ? (
            <SpaceShareIcon {...props} spaceIdOrName={space?.name || spaceIdOrName} title={space?.title} />
          ) : null}
          {renderActionDrawer()}
        </View>
      ),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [
    id,
    isAdmin,
    isMember,
    isWeb,
    navigate,
    renderActionDrawer,
    setScreenOptions,
    space,
    spaceGeneralTabRoom,
    spaceIdOrName,
    spaceNotificationCount,
    t,
  ])

  const onUpdateButtonPress = () => {
    navigate(`/spaces/${spaceIdOrName}/updates/create`)
  }

  const UpdateButton = () => {
    return (
      <HoliButton
        label={t('spaces.toolKit.add.button.label')}
        testID="space-add-post-button"
        style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}
        onPress={onUpdateButtonPress}
      >
        <HoliIcon icon={Pencil} size={20} />
      </HoliButton>
    )
  }

  if ((error && isNotFoundError(error)) || (!loading && !space)) {
    return (
      <DefaultLayout style={styles.defaultLayout} contentStyle={[styles.contentStyle, styles.messageContainer]}>
        <HoliText>{t('spaces.spaceDetails.notFound', { spaceIdOrName })}</HoliText>
      </DefaultLayout>
    )
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space) {
    return <></>
  }

  return (
    <SafeAreaProvider>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          isLoading: refreshing,
          onRefresh,
        }}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
        keyboardShouldPersistTaps="handled"
      >
        <SpaceDetailView style={styles.spaceDetailView} space={space} onChangeTab={setCurrentTabIndex} />
        <SpaceOnboardModal visible={visible} handleModalClose={handleModalClose} />
      </ScrollHeaderLayout.Refreshable>
      {isMember && currentTabIndex === 2 && <AddNewDrawer spaceIdOrName={space.name} />}
      {isMember && currentTabIndex === 1 && <UpdateButton />}
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingBottom: 0,
    paddingTop: +vars.topBarHeight,

    ...Platform.select({
      web: {
        height: '100vh',
        maxHeight: '100%',
      },
      default: {
        minHeight: '100%',
      },
    }),
  },
  contentStyle: {
    paddingBottom: 0,
    paddingTop: +vars.topBarHeight,
    minHeight: '100%',
  },
  spaceDetailView: {
    flex: 1,
    paddingTop: 0,
    ...Platform.select({
      web: {
        paddingTop: 12,
      },
    }),
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: +vars.topBarHeight + 50,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    bottom: +vars.topBarHeight,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    justifyContent: 'center',
    right: '50%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
  floatingContainer: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 42,
    left: 0,
    right: 0,
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
})

export default withProfiler(memo(SpaceDetails), { name: 'SpaceDetails' })
