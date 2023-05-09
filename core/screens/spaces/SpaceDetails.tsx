import { useMutation, useQuery } from '@apollo/client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import DeleteOptionButton from '@holi/core/components/DeleteOptionButton'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks/useErrorHandling'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { ContentType } from '@holi/core/queries'
import AddNewDrawer from '@holi/core/screens/spaces/components/AddNewDrawer'
import SpaceDetailView from '@holi/core/screens/spaces/components/SpaceDetailView'
import SpaceShare from '@holi/core/screens/spaces/components/SpaceShare'
import {
  DeleteSpaceResponse,
  SpaceByIdResponse,
  deleteSpaceMutation,
  mySpaceQuery,
  spaceByIdQuery,
} from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { vars } from '@holi/ui/styles/globalVars'

export type SpaceDetailsParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceDetailsParams>()

const SpaceDetails = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)

  const { t } = useTranslation()
  const { navigate, replaceRoute } = useRouting()
  const [currentTabIndex, setCurrentTabIndex] = useState<number>()

  const { setOptions } = useUnifiedNavigation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { visible, show, hide } = useModalState()

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById

  const [deleteSpace, { loading: loadingDeleteSpace }] = useMutation<DeleteSpaceResponse>(deleteSpaceMutation, {
    variables: { id: space?.id },
    onCompleted: () => {
      openToast(t('spaces.delete.success'), HoliToastType.SUCCESS)
    },
    onError: (error) => displayError(error, t('spaces.delete.error')),
    refetchQueries: [{ query: mySpaceQuery }],
  })

  const handleSpaceDelete = useCallback(async () => {
    hide()
    replaceRoute('/spaces/')

    try {
      await deleteSpace()
    } catch (e) {
      logError(e)
    }
  }, [deleteSpace, hide, replaceRoute])

  const isCreator = space?.connectionStatusToMyself?.includes(SpaceConnectionType.CREATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  useEffect(() => {
    setOptions({
      animation: 'slide_from_bottom',
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTitle: () => null,
      headerLeft: () =>
        Platform.OS === 'web' ? <HeaderBackButton icon="arrow-left" /> : <HeaderBackButton icon="arrow-down-s" />,
      headerRight: ({ tintColor }) => (
        <MoreOptionsButtonWithModal
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
          tintColor={tintColor}
          testID="space-options-btn"
        >
          {isAdmin && (
            <HoliBox padding={[18, 0]}>
              <MoreOptionItem
                icon="edit-2"
                label={t('global.edit')}
                onPress={() => {
                  navigate(`/spaces/${spaceIdOrName}/edit`)
                  hide()
                }}
              />
            </HoliBox>
          )}

          {space && <SpaceShare space={space} />}

          <ReportBlockOptionButton
            action="report"
            objectId={space?.id || ''}
            contentType={ContentType.SPACE}
            style={styles.reportButton}
            confirmationModalProps={{
              title: t('spaces.spaceDetails.report.confirmation.title'),
              description: t('spaces.spaceDetails.report.confirmation.description'),
            }}
            successMessage={t('global.report.successMessage')}
            onConfirm={hide}
          />
          {isAdmin && (
            <HoliBox padding={[18, 0]}>
              <DeleteOptionButton
                isLoading={loadingDeleteSpace}
                itemTestID="space-delete-btn"
                confirmationDesc={t('spaces.delete.confirmation.description')}
                confirmationTitle={t('spaces.delete.confirmation.title')}
                confirmationTestID="space-delete"
                onDelete={handleSpaceDelete}
              />
            </HoliBox>
          )}
        </MoreOptionsButtonWithModal>
      ),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [
    hide,
    show,
    handleSpaceDelete,
    isMember,
    isAdmin,
    loadingDeleteSpace,
    navigate,
    replaceRoute,
    setOptions,
    space,
    spaceIdOrName,
    t,
    visible,
  ])

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
  reportButton: {
    justifyContent: 'center',
    paddingVertical: 18,
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
