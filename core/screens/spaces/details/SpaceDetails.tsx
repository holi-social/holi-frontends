import { withProfiler } from '@sentry/react'
import { useAtomValue } from 'jotai'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { spaceRoomAtomCreator } from '@holi/chat/src/store'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isSSR } from '@holi/core/helpers/isSSR'
import useDeleteSpace from '@holi/core/hooks/spaces/useDeleteSpace'
import { useLeaveSpace } from '@holi/core/hooks/spaces/useLeaveSpace'
import useRefreshOnNavigation, { RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import useReportContent from '@holi/core/hooks/useReportContent'
import useTabNavigation, { TabNavigationParams } from '@holi/core/hooks/useTabNavigation'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import SpaceOnboardModal from '@holi/core/screens/spaces/components/SpaceOnboardModal'
import AddNewDrawer from '@holi/core/screens/spaces/details/components/AddNewDrawer'
import SpaceDetailView, {
  SPACE_DETAILS_TABS_IN_ORDER,
  SpaceDetailsTabs,
} from '@holi/core/screens/spaces/details/components/SpaceDetailView'
import SpaceShareIcon from '@holi/core/screens/spaces/details/components/SpaceShareIcon'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { useSpaceOnboarding } from '@holi/core/screens/spaces/hooks/useSpaceOnboarding'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Delete, DoorClosed, Edit2, Flag, Pencil, UserSettings } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

export type SpaceDetailsParams = RefreshOnNavigationParams &
  TabNavigationParams & {
    spaceIdOrName: string
  }

const { useParam } = createParamHooks<SpaceDetailsParams>()

const SpaceDetails = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { theme } = useTheme()
  const { colors } = theme

  const { loading, error, space, refetch, called } = useSpace(spaceIdOrName)
  useOnRefresh(refetch)

  const isWeb = Platform.OS === 'web'
  const id = space?.id || `${spaceIdOrName}`

  const [isLoading, deleteSpace] = useDeleteSpace(id)
  const [isLoadingReport, reportContent] = useReportContent({
    id,
    contentType3k: ContentType3K.SPACE,
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
  const loginState = useLoggedInUser()

  const isCreator = loginState.isLoggedIn && space?.creator?.id === loginState.user.id

  useRefreshOnNavigation({ initialized: called })

  useEffect(() => {
    if (!isOnboarded && !isCreator && isMember) {
      show()
    }
  }, [space, show, isOnboarded, isCreator, isMember])

  const determineInitialTab = useCallback(() => {
    if (loading || isSSR) {
      return undefined
    }

    const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
    const hasInvolvementContent = space?.tasks?.length !== 0 || space?.collaborationTools?.length !== 0
    if (!isMember) {
      return SpaceDetailsTabs.INFO
    }
    if (hasInvolvementContent) {
      return SpaceDetailsTabs.INVOLVEMENT
    }
    return SpaceDetailsTabs.UPDATES
  }, [loading, space?.collaborationTools?.length, space?.connectionStatusToMyself, space?.tasks?.length])

  const { initialTabIndex, currentTabName, selectTabWithIndex } = useTabNavigation({
    tabNamesInOrder: SPACE_DETAILS_TABS_IN_ORDER,
    determineInitialTab,
  })

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
                testID="space-edit"
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

  const spaceRoom = useAtomValue(useMemo(() => spaceRoomAtomCreator(id), [id]))

  useEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTransparent: true,
      headerTintColor: colors.foreground30,
      headerTitle: '',
      headerLeft: () => <HeaderBackButton />,
      headerRight: (props) => (
        <View style={styles.headerRight}>
          {(isMember || isAdmin) && spaceRoom && (
            <HoliButtonBell
              label={t('spaces.actions.chat', { spaceName: space?.name })}
              icon={Chat3}
              showBell={spaceRoom.notificationCount > 0}
              onPress={() => {
                navigate(`/chat?activeTab=${spaceRoom.id}`)
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
    spaceRoom,
    spaceIdOrName,
    t,
    colors.background10,
    colors.foreground30,
  ])

  const onUpdateButtonPress = () => {
    navigate(`/spaces/${spaceIdOrName}/updates/create`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (error || !space) {
    return <HoliLoader />
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

  return (
    <>
      <ScrollHeaderLayout backgroundColor={colors.background20} keyboardShouldPersistTaps="handled">
        <SpaceDetailView space={space} onChangeTabIndex={selectTabWithIndex} initialTabIndex={initialTabIndex} />
        <SpaceOnboardModal visible={visible} handleModalClose={handleModalClose} />
      </ScrollHeaderLayout>
      {isMember && currentTabName === SpaceDetailsTabs.INVOLVEMENT && <AddNewDrawer spaceIdOrName={space.name} />}
      {isMember && currentTabName === SpaceDetailsTabs.UPDATES && <UpdateButton />}
    </>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: dimensions.topBarHeight + 50,
  },
  overlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    bottom: dimensions.topBarHeight,
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
})

export default withProfiler(memo(SpaceDetails), { name: 'SpaceDetails' })
