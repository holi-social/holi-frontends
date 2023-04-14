import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type TaskDetailsParams = {
  spaceIdOrName: string
  taskId: string
}

const { useParam } = createParam<TaskDetailsParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const TaskDetails: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const [taskId] = useParam('taskId')

  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { setOptions } = useUnifiedNavigation()

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const task = (space?.tasks || []).find((t) => t.id === taskId)

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  useLayoutEffect(() => {
    setOptions({
      animation: 'slide_from_left',
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTitle: () => <HoliText>{t('spaces.tasks.details.title')}</HoliText>,
      headerLeft: () => <HeaderBackButton icon="arrow-left" />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setOptions, t])

  if ((error && isNotFoundError(error)) || (!loading && !task)) {
    return (
      <DefaultLayout style={styles.defaultLayout} contentStyle={[styles.contentStyle, styles.messageContainer]}>
        <HoliText>{t('spaces.tasks.notFound', { taskId })}</HoliText>
      </DefaultLayout>
    )
  }
  if (error) {
    logError(error, `[TaskDetails.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space || !task) {
    return <></>
  }

  return (
    <>
      <DefaultScrollHeaderLayout style={styles.defaultLayout} contentStyle={styles.contentStyle} headerOverlap>
        <View style={mixins.container}>
          <SpaceTaskTile task={task} space={space} isAdmin={isAdmin} showFullView />
        </View>
      </DefaultScrollHeaderLayout>
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
    paddingTop: vars.topBarHeight,

    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: vars.topBarHeight + 50,
  },
})

export default memo(TaskDetails)
