import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import NotificationModal from '@holi/core/components/NotificationModal'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import useDeleteSpace from '@holi/core/hooks/spaces/useDeleteSpace'
import { useLeaveSpace } from '@holi/core/hooks/spaces/useLeaveSpace'
import { useShareSpace } from '@holi/core/hooks/spaces/useShareSpace'
import useReportContent from '@holi/core/hooks/useReportContent'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { ContentType } from '@holi/core/queries'
import SpaceOnboardModal from '@holi/core/screens/spaces/components/SpaceOnboardModal'
import AddNewDrawer from '@holi/core/screens/spaces/details/components/AddNewDrawer'
import SpaceDetailView from '@holi/core/screens/spaces/details/components/SpaceDetailView'
import { MySpacesResponse, mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import { useSpaceOnboarding } from '@holi/core/screens/spaces/helpers/hooks'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { vars } from '@holi/ui/styles/globalVars'

export type SpaceDetailsParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceDetailsParams>()

const SpaceDetails = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>()

  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { setOptions } = useUnifiedNavigation()

  const [showShareConfirmation, setShowShareConfirmation] = useState(false)

  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)

  // On initial page load on web `spaceIdOrName` is be undefined
  // > will probably be solved with ssr
  // see https://github.com/nandorojo/solito/issues/100
  const { loading, error, data, refetch } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName || '' },
  })
  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const isWeb = Platform.OS === 'web'
  const space = data?.spaceById
  const id = space?.id || `${spaceIdOrName}`

  const [isLoading, deleteSpace] = useDeleteSpace(id)
  const [spaceUrl, shareSpaceUrl] = useShareSpace(space?.title ?? '', `/spaces/${space?.name}`)
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

  const { isLoggedIn } = useLoggedInUser()

  const { data: mySpacesData } = useQuery<MySpacesResponse>(mySpaceQuery, { skip: !isLoggedIn })
  const { isOnboarded, setIsOnboarded } = useSpaceOnboarding('space_join_is_onboarded')
  const { visible, show, hide } = useModalState()
  const { userId } = useAuth()

  useEffect(() => {
    const mySpacesList = mySpacesData?.mySpaces.flatMap((section) => section.spaces.data) || []

    if (
      !isOnboarded &&
      mySpacesList.some(
        (space) => space.creator?.id !== userId && space.connectionStatusToMyself.includes(SpaceConnectionType.MEMBER)
      )
    ) {
      show()
    }
  }, [mySpacesData, show, isOnboarded, userId])

  const handleModalClose = () => {
    setIsOnboarded()
    hide()
  }

  const editAction = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/edit`)
  }, [navigate, spaceIdOrName])

  const deleteConfirmationAction = useCallback(() => {
    navigate('/spaces')
    deleteSpace().catch((e) => logError(e))
  }, [deleteSpace, navigate])

  const shareWebAction = useCallback(() => {
    shareSpaceUrl()
    setShowShareConfirmation(true)

    setTimeout(() => setShowShareConfirmation(false), 1500)
  }, [setShowShareConfirmation, shareSpaceUrl])

  const renderActionDrawer = useCallback(
    () => (
      <>
        <HoliActionDrawer.Drawer label={t('global.moreOptions')} testID="space-options-btn">
          {isAdmin && (
            <HoliActionDrawer.Action
              isLoading={isLoading}
              action="edit"
              title={t('global.edit')}
              handleAction={editAction}
            />
          )}

          {space && (
            <HoliActionDrawer.Action
              action="share"
              title={t('global.share')}
              handleAction={isWeb ? undefined : shareSpaceUrl}
              showConfirmation={isWeb}
              testID="space-share"
            >
              <HoliActionDrawer.Confirmation
                title={t('global.share')}
                description={spaceUrl}
                testID="space-share"
                handleConfirmation={shareWebAction}
                confirmText={t('global.share.copy.link')}
              />
            </HoliActionDrawer.Action>
          )}

          <HoliActionDrawer.Action
            isLoading={isLoadingLeaveSpace}
            action="leave"
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

          <HoliActionDrawer.Action
            isLoading={isLoadingReport}
            action="report"
            title={t('global.report')}
            showConfirmation
          >
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
              action="delete"
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
        {/* Success Modal for copying a URL to the clipboard driven by the share action */}
        {isWeb && (
          <NotificationModal
            label={t('global.share')}
            isVisible={showShareConfirmation}
            setVisibility={setShowShareConfirmation}
          >
            <HoliText bold color="error200">
              {t('global.share.copied')}
            </HoliText>
          </NotificationModal>
        )}
      </>
    ),
    [
      reportContent,
      deleteConfirmationAction,
      leaveSpaceAction,
      editAction,
      isAdmin,
      isWeb,
      space,
      spaceUrl,
      t,
      isLoadingReport,
      shareSpaceUrl,
      shareWebAction,
      isLoading,
      showShareConfirmation,
      confirmationDescription,
      confirmationTitle,
      isLoadingLeaveSpace,
      confirmLeaveSpaceText,
      dismissLeaveSpaceButton.show,
      dismissLeaveSpaceButton.text,
    ]
  )

  useEffect(() => {
    setOptions({
      animation: 'slide_from_bottom',
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTitle: () => null,
      headerLeft: () =>
        Platform.OS === 'web' ? <HeaderBackButton icon="arrow-left" /> : <HeaderBackButton icon="arrow-down-s" />,
      headerRight: () => renderActionDrawer(),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [renderActionDrawer, setOptions])

  const handleTabChange = (index: number) => {
    global.spaceDetailInitialTabIndex = index

    setCurrentTabIndex(index)
  }

  const onUpdateButtonPress = () => {
    navigate(`/spaces/${spaceIdOrName}/updates/create`)
  }

  const UpdateButton = () => {
    return (
      <HoliButton
        label={t('spaces.toolKit.add.button.label')}
        testID="space-add-post-button"
        style={styles.overlayButton}
        onPress={onUpdateButtonPress}
      >
        <HoliIcon icon="pencil" size={20} />
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
  if (error) {
    logError(error, `[SpaceDetails.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space) {
    return <></>
  }

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          isLoading: refreshing,
          onRefresh,
        }}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
      >
        <SpaceDetailView
          style={styles.spaceDetailView}
          space={space}
          onChangeTab={handleTabChange}
          initialTabIndex={global.spaceDetailInitialTabIndex}
        />
        <SpaceOnboardModal visible={visible} handleModalClose={handleModalClose} />
      </ScrollHeaderLayout.Refreshable>
      {isMember && currentTabIndex === 2 && <AddNewDrawer spaceIdOrName={space.name} />}
      {isMember && currentTabIndex === 1 && <UpdateButton />}
    </>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingBottom: 0,
    paddingTop: vars.topBarHeight,

    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  contentStyle: {
    paddingBottom: 0,
    paddingTop: vars.topBarHeight,

    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
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
    marginTop: vars.topBarHeight + 50,
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
    bottom: vars.topBarHeight,
    right: 24,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    justifyContent: 'center',
  },
})

export default memo(SpaceDetails)
