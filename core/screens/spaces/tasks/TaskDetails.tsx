import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import useDeleteTask from '@holi/core/hooks/spaces/useDeleteTask'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, More } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type TaskDetailsParams = {
  spaceIdOrName: string
  taskId: string
}

const { useParam } = createParam<TaskDetailsParams>()

const TaskDetails = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const [taskId] = useParam('taskId')
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()

  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { loading, error, data, refetch } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
    onError: (error) =>
      !isNotFoundError(error) &&
      logError(error, 'Failed to load space', { location: 'TaskDetails.spaceByIdQuery', spaceIdOrName }),
  })
  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const space = data?.spaceById
  const task = (space?.tasks || []).find((t) => t.id === taskId)

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const [isLoadingDeleteTask, deleteTask] = useDeleteTask({
    id: task?.id || '',
    spaceIdOrName: space?.name || '',
    successMsg: t('spaces.tasks.delete.success'),
    handleDelete: () => {
      navigate(`/spaces/${space?.name}`)
    },
  })

  const renderActionDrawer = useCallback(
    () => (
      <>
        {isAdmin && (
          <HoliActionDrawer.Drawer
            label={t('global.moreOptions')}
            testID="btn-task-more-options"
            buttonElement={<HoliIcon icon={More} color={colors.foreground30} />}
          >
            <HoliActionDrawer.Action
              action="edit"
              title={t('global.edit')}
              testID="btn-to-edit-task"
              handleAction={() => navigate(`/spaces/${space?.name}/tasks/${task?.id}/edit`)}
            />
            <HoliActionDrawer.Action
              isLoading={isLoadingDeleteTask}
              icon={Delete}
              action="delete"
              title={t('spaces.digitalTool.delete.label')}
              variant="danger"
              testID="btn-to-delete-task"
              showConfirmation
            >
              <HoliActionDrawer.Confirmation
                title={t('spaces.tasks.delete.confirmation.title')}
                description={t('spaces.tasks.delete.confirmation.description')}
                testID="task-delete"
                handleConfirmation={deleteTask}
                buttonType="warning"
                hasDismissBtn
                requireLogin
              />
            </HoliActionDrawer.Action>
          </HoliActionDrawer.Drawer>
        )}
      </>
    ),
    [isAdmin, t, isLoadingDeleteTask, deleteTask, navigate, space?.name, task?.id]
  )

  useLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_left',
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => <HoliText>{t('spaces.tasks.details.title')}</HoliText>,
      headerLeft: () => <HeaderBackButton />,
      headerRight: () => <View style={styles.headerRight}>{renderActionDrawer()}</View>,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [renderActionDrawer, setScreenOptions, t])

  if ((error && isNotFoundError(error)) || (!loading && !task)) {
    return (
      <DefaultLayout style={styles.defaultLayout} contentStyle={[styles.contentStyle, styles.messageContainer]}>
        <HoliText>{t('spaces.tasks.notFound', { taskId })}</HoliText>
      </DefaultLayout>
    )
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space || !task) {
    return <></>
  }

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{ isLoading: refreshing, onRefresh }}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
      >
        <View style={mixins.container}>
          <SpaceTaskTile task={task} space={space} isAdmin={isAdmin} showFullView />
        </View>
      </ScrollHeaderLayout.Refreshable>
    </>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingBottom: 120,
    minHeight: '100%',
    paddingTop: vars.topBarHeight,
    backgroundColor: colors.background20,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  contentStyle: {
    paddingBottom: 0,
    // paddingTop: vars.topBarHeight,
    ...Platform.select({
      web: {
        minHeight: '100vh',
        paddingTop: 12,
      },
      native: {
        paddingTop: vars.topBarHeight,
      },
    }),
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: vars.topBarHeight + 50,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
})

export default memo(TaskDetails)
