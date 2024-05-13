import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import HoliHead from '@holi/core/components/HoliHead'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { SeoTitle } from '@holi/core/components/SeoTitle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import useDeleteTask from '@holi/core/hooks/spaces/useDeleteTask'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, Edit2, More } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { SafeAreaProvider } from '@holi/ui/components/atoms/SafeAreaProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type TaskDetailsParams = {
  spaceIdOrName: string
  taskId: string
}

const { useParam } = createParamHooks<TaskDetailsParams>()

const TaskDetails = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const [taskId] = useParam('taskId')
  const setScreenOptions = useSetScreenOptions()
  const { navigate, replaceRoute } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { t } = useTranslation()

  const { error, space, refetch } = useSpace(spaceIdOrName)
  const { refreshing, onRefresh } = useOnRefresh(refetch)

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
              icon={Edit2}
              title={t('global.edit')}
              testID="btn-to-edit-task"
              handleAction={() => navigate(`/spaces/${space?.name}/tasks/${task?.id}/edit`)}
            />
            <HoliActionDrawer.Action
              isLoading={isLoadingDeleteTask}
              icon={Delete}
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
    [isAdmin, t, isLoadingDeleteTask, deleteTask, navigate, space?.name, task?.id, colors.foreground30]
  )

  useIsomorphicLayoutEffect(() => {
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
  }, [renderActionDrawer, setScreenOptions, t, styles.headerRight, colors.background10])

  if (space && !task) {
    replaceRoute('/404')
    return <></>
  }

  // Error and loading states are handled the same way and just hide the component
  if (error || !space || !task) {
    return <></>
  }

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <HoliHead
        title={`${task.name} | ${space.title}`}
        description={task.description}
        ogTitle={`${task.name} | ${space.title}`}
        ogDescription={task.description}
        ogImage={task.thumbnail || space.cover}
      />
      <SeoTitle seoTitle={`${task.name} | ${space.name}`.trim()} />
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{ refreshing, onRefresh }}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
      >
        <HoliContainer>
          <SpaceTaskTile task={task} space={space} isAdmin={isAdmin} variant={'full'} />
        </HoliContainer>
      </ScrollHeaderLayout.Refreshable>
    </SafeAreaProvider>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    safeAreaProvider: {
      flex: 1,
      display: 'flex',
      minHeight: '100%',
    },
    defaultLayout: {
      paddingBottom: 120,
      minHeight: '100%',
      paddingTop: dimensions.topBarHeight,
      backgroundColor: theme.colors.background20,
    },
    contentStyle: {
      paddingBottom: 0,
      ...Platform.select({
        web: {
          paddingTop: 12,
        },
        native: {
          paddingTop: dimensions.topBarHeight,
        },
      }),
      minHeight: '100%',
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: dimensions.topBarHeight + 50,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 14,
    },
  })

export default memo(TaskDetails)
