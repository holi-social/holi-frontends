import { withProfiler } from '@sentry/react'
import { useAtomValue } from 'jotai'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { spaceRoomAtomCreator } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { isSSR } from '@holi/core/helpers/isSSR'
import useDeleteSpace from '@holi/core/hooks/spaces/useDeleteSpace'
import { useLeaveSpace } from '@holi/core/hooks/spaces/useLeaveSpace'
import useRefreshOnNavigation, { type RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import type { TabNavigationParams } from '@holi/core/hooks/useTabNavigation'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import SpaceOnboardModal from '@holi/core/screens/spaces/components/SpaceOnboardModal'
import AddNewDrawer from '@holi/core/screens/spaces/details/components/AddNewDrawer'
import SpaceDetailView, { SpaceDetailsTabs } from '@holi/core/screens/spaces/details/components/SpaceDetailView'
import SpaceShareIcon from '@holi/core/screens/spaces/details/components/SpaceShareIcon'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { useSpaceOnboarding } from '@holi/core/screens/spaces/hooks/useSpaceOnboarding'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Delete, DoorClosed, Edit2, Flag, Pencil, Spaces, UserSettings } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useHoliTabQueryParamSetter } from '@holi/ui/components/organisms/HoliTabs/helpers'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { AskQuestion } from '@holi/core/screens/spaces/details/components/AskQuestion'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

export type SpaceDetailsParams = RefreshOnNavigationParams &
  TabNavigationParams & {
    spaceIdOrName: string
  }

const { useParam } = createParamHooks<SpaceDetailsParams>()

const SpaceDetails = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const setScreenOptions = useSetScreenOptions()
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { loading, error, space, refetch, called } = useSpace(spaceIdOrName)
  useOnRefresh(refetch)
  const { show: showAddNewDrawerModal, props: addNewDrawerModalProps } = useModalState()

  const isWeb = Platform.OS === 'web'
  const id = space?.id || `${spaceIdOrName}`

  const [isLoading, deleteSpace] = useDeleteSpace(id)

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
    const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
    const hasInvolvementContent = space?.tasks?.length !== 0 || space?.collaborationTools?.length !== 0
    if (!isMember) {
      return SpaceDetailsTabs.INFO
    }
    if (hasInvolvementContent) {
      return SpaceDetailsTabs.INVOLVEMENT
    }
    return SpaceDetailsTabs.UPDATES
  }, [space?.collaborationTools?.length, space?.connectionStatusToMyself, space?.tasks?.length])

  const onlyAllowKnownTabs = (value: string | undefined): string | undefined =>
    !!value && Object.values(SpaceDetailsTabs).includes(value as SpaceDetailsTabs) ? value : undefined

  const [tabParam] = useParam('tab', singleParamConfig)
  const activeTab = onlyAllowKnownTabs(tabParam)
  const setHoliTabQueryParam = useHoliTabQueryParamSetter(activeTab)
  const onTabChange = (key: string) => {
    setHoliTabQueryParam(key)
  }

  const isReadyToDetermineTab = !activeTab && !loading && !isSSR
  useEffect(() => {
    if (isReadyToDetermineTab) {
      const tabKey = determineInitialTab()
      setHoliTabQueryParam(tabKey)
    }
  }, [determineInitialTab, isReadyToDetermineTab, setHoliTabQueryParam])

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
          <HoliActionDrawer.Action
            icon={Flag}
            title={t('global.report')}
            handleAction={() => navigateWithAuth(`/report/${id}/${ContentType.SPACE}/${ContentType3K.SPACE}`)}
          />

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
      deleteConfirmationAction,
      leaveSpaceAction,
      editAction,
      isMember,
      manageCollaboratorsAction,
      isAdmin,
      t,
      isLoading,
      confirmationDescription,
      navigateWithAuth,
      id,
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
    styles.headerRight,
  ])

  const onUpdateButtonPress = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/updates/create`)
  }, [navigate, spaceIdOrName])

  // Error and loading states are handled the same way and just hide the component
  if (error || !space) {
    return <HoliLoader />
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollViewRefreshable
        style={{ backgroundColor: colors.background20, flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab && <SpaceDetailView space={space} activeTab={activeTab} onTabChange={onTabChange} />}
        <SpaceOnboardModal visible={visible} handleModalClose={handleModalClose} />
      </ScrollViewRefreshable>

      {isMember && activeTab && (
        <HoliTransition.FadeRightSwitch animKey={activeTab} style={styles.floatingButtonsContainer}>
          <HoliContainer flexDirection="row-reverse">
            {activeTab === SpaceDetailsTabs.INVOLVEMENT && (
              <HoliButton
                label={t('allTools.drawer.headline')}
                type="secondary"
                inline
                testID="space-resources-add-button"
                style={[styles.floatingButton, styles.addNewDrawerButton]}
                onPress={showAddNewDrawerModal}
              >
                <HoliText style={styles.addNewDrawerButtonTitle}>{t('allTools.drawer.toolKit.button.label')}</HoliText>
                <HoliIcon icon={Spaces} size={20} />
              </HoliButton>
            )}

            {activeTab === SpaceDetailsTabs.UPDATES && (
              <HoliButton
                label={t('spaces.toolKit.add.button.label')}
                testID="space-add-post-button"
                style={[styles.floatingButton, styles.addPostButton]}
                onPress={onUpdateButtonPress}
              >
                <HoliIcon icon={Pencil} size={20} />
              </HoliButton>
            )}
          </HoliContainer>
        </HoliTransition.FadeRightSwitch>
      )}

      <AskQuestion spaceIdOrName={spaceIdOrName} />
      <AddNewDrawer spaceIdOrName={space.name} {...addNewDrawerModalProps} />
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    floatingButtonsContainer: {
      bottom: dimensions.topBarHeight,
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      width: '100%',
    },
    floatingButton: {
      bottom: 0,
    },
    addPostButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 1,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    addNewDrawerButton: {
      justifyContent: 'center',
      paddingHorizontal: 20,
      borderWidth: 1,
      shadowColor: theme.colors.foreground30,
      backgroundColor: theme.colors.background10,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      overflow: 'visible',
    },
    addNewDrawerButtonTitle: {
      marginRight: 6,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 14,
    },
  })

export default withProfiler(memo(SpaceDetails), { name: 'SpaceDetails' })
