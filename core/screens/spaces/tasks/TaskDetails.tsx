import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import HoliHead from '@holi/core/components/HoliHead'
import { SeoTitle } from '@holi/core/components/SeoTitle'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { taskByIdQuery } from '@holi/core/screens/spaces/details/queries'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type TaskDetailsParams = {
  spaceIdOrName: string
  taskId: string
}

const { useParam } = createParamHooks<TaskDetailsParams>()

const TaskDetails = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const [taskId] = useParam('taskId')
  const setScreenOptions = useSetScreenOptions()
  const { replaceRoute } = useRouting()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { t } = useTranslation()

  const { error, space, refetch } = useSpace(spaceIdOrName)
  useOnRefresh(refetch)

  const { data, loading } = useQuery(taskByIdQuery, {
    variables: {
      id: taskId,
    },
    skip: !taskId,
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network', // ensures that all required fields are eventually present for members
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to load task', {
        location: 'TaskDetails.taskByIdQuery',
        spaceIdOrName,
      })
    },
  })

  const task = data?.taskById

  const renderActionDrawer = useCallback(() => task && space && <TaskDrawer task={task} space={space} />, [task, space])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_left',
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: () => <HoliText>{t('spaces.tasks.details.title')}</HoliText>,
      headerLeft: () => <HeaderBackButton />,
      headerRight: () => <View style={styles.headerRight}>{renderActionDrawer()}</View>,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [renderActionDrawer, setScreenOptions, t, styles.headerRight, colors.background10])

  if (!loading && !task) {
    replaceRoute('/404')
    return <></>
  }

  // Error and loading states are handled the same way and just hide the component
  if (error || !space || !task) {
    return <></>
  }

  return (
    <>
      <HoliHead
        title={`${task.name} | ${space.title}`}
        description={task.description}
        ogTitle={`${task.name} | ${space.title}`}
        ogDescription={task.description}
        ogImage={task.thumbnail || space.cover}
      />

      <SeoTitle seoTitle={`${task.name} | ${space.name}`.trim()} />
      <ScrollView style={styles.defaultLayout} contentContainerStyle={styles.contentStyle}>
        <HoliContainer>
          <SpaceTaskTile variant="full" task={task} space={space} />
        </HoliContainer>
      </ScrollView>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    defaultLayout: {
      backgroundColor: theme.colors.background20,
    },
    contentStyle: {
      paddingTop: 12,
      paddingBottom: 120,
      minHeight: '100%',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 14,
    },
  })

export default memo(TaskDetails)
