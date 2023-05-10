import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import ActionDrawer from '@holi/core/components/ActionDrawer'
import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useDeleteSpace from '@holi/core/hooks/spaces/useDeleteSpace'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { ContentType } from '@holi/core/queries'
import AddNewDrawer from '@holi/core/screens/spaces/components/AddNewDrawer'
import SpaceDetailView from '@holi/core/screens/spaces/components/SpaceDetailView'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { vars } from '@holi/ui/styles/globalVars'

export type SpaceDetailsParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceDetailsParams>()

const SpaceDetails = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)

  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [currentTabIndex, setCurrentTabIndex] = useState<number>()

  const { setOptions } = useUnifiedNavigation()

  const { visible, show, hide } = useModalState()

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById

  const [isLoadingDeleteSpace, deleteSpace] = useDeleteSpace(space?.id || `${spaceIdOrName}`)

  const isCreator = space?.connectionStatusToMyself?.includes(SpaceConnectionType.CREATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const renderActionDrawer = useCallback(
    () => (
      <ActionDrawer.Drawer
        label={t('insights.post.preview.more')}
        showOptions={visible}
        onPress={() => {
          // if pressed too soon, the state is set to true, but the modal is not shown.
          // crude mechanism to recover from this state.
          // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
          visible && hide()
          show()
        }}
        onModalDismiss={hide}
        testID="space-options-btn"
      >
        {isAdmin && (
          <ActionDrawer.Edit
            label={t('global.edit')}
            onPress={() => {
              navigate(`/spaces/${spaceIdOrName}/edit`)
              hide()
            }}
          />
        )}

        {space && <ActionDrawer.Share slug={`/spaces/${space.name}`} title={space.title} />}

        <ActionDrawer.Report
          action="report"
          objectId={space?.id || ''}
          contentType={ContentType.SPACE}
          confirmationModalProps={{
            title: t('spaces.spaceDetails.report.confirmation.title'),
            description: t('spaces.spaceDetails.report.confirmation.description'),
          }}
          successMessage={t('global.report.successMessage')}
          onConfirm={hide}
        />

        {isAdmin && (
          <ActionDrawer.Delete
            isLoading={isLoadingDeleteSpace}
            itemTestID="space-delete-btn"
            confirmationDesc={t('spaces.delete.confirmation.description')}
            confirmationTitle={t('spaces.delete.confirmation.title')}
            confirmationTestID="space-delete"
            handleDelete={() => {
              hide()
              navigate('/spaces')
              deleteSpace()
            }}
          />
        )}
      </ActionDrawer.Drawer>
    ),
    [deleteSpace, hide, isAdmin, isLoadingDeleteSpace, navigate, show, space, spaceIdOrName, t, visible]
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
      <DefaultScrollHeaderLayout style={styles.defaultLayout} contentStyle={styles.contentStyle} headerOverlap>
        <SpaceDetailView
          style={styles.spaceDetailView}
          space={space}
          onChangeTab={handleTabChange}
          initialTabIndex={global.spaceDetailInitialTabIndex}
        />
      </DefaultScrollHeaderLayout>
      {(isCreator || isMember) && currentTabIndex === 2 && <AddNewDrawer spaceIdOrName={space.name} />}
      {(isCreator || isMember) && currentTabIndex === 1 && <UpdateButton />}
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
