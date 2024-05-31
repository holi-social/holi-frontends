import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import HoliHead from '@holi/core/components/HoliHead'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { SeoTitle } from '@holi/core/components/SeoTitle'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { taskByIdQuery } from '@holi/core/screens/spaces/details/queries'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { SafeAreaProvider } from '@holi/ui/components/atoms/SafeAreaProvider'
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
  const { replaceRoute } = useRouting()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { t } = useTranslation()

  const { error, space, refetch } = useSpace(spaceIdOrName)
  const { refreshing, onRefresh } = useOnRefresh(refetch)

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

  if (!loading && !task) {
    replaceRoute('/404')
    return <></>
  }

  // Error and loading states are handled the same way and just hide the component
  if (error || !space || !task) {
    return <></>
  }

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

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
          <SpaceTaskTile task={task} space={space} isAdmin={isAdmin} variant="full" />
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
