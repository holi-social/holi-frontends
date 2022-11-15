import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpaceTaskTile from '@holi/core/screens/spaces/SpaceTaskTile'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { Task } from './types'

export type SpaceDetailsParams = {
  spaceId: string
}

const { useParam } = createParam<SpaceDetailsParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SpaceDetails: React.VFC<ScreenProps> = () => {
  const [spaceId] = useParam('spaceId')

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  useLayoutEffect(() => setOptions({ title: 'Space Details' }), [setOptions])

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { id: spaceId },
  })

  if (error) {
    logError(error, `[SpaceDetails.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }
  const space = data?.spaceById

  if (!space) return <HoliText>{t('spaces.spaceDetails.notFound', { spaceId })}</HoliText>

  const creator = {
    ...space.creator,
    fullName: userFullName(space.creator),
  }

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <View style={[mixins.container, { justifyContent: 'center', padding: 24 }]}>
        <HoliHeading level="1">{space.title}</HoliHeading>
        <HoliText style={{ paddingTop: 10 }}>
          <Trans i18nKey="spaces.spaceDetails.creator" values={{ name: creator.fullName || t('Anonymous user') }} />
        </HoliText>
        <HoliText style={{ paddingTop: 10 }}>{space.description}</HoliText>
        {space.tasks && space.tasks.length > 0 && (
          <View>
            <HoliHeading level="2">
              {space.tasks.length} {t('spaces.spaceDetails.waysToActHeading')}
            </HoliHeading>
            <ScrollView horizontal={true} style={{ marginTop: 20 }} contentContainerStyle={styles.tasksContainer}>
              {space.tasks.map((task: Task) => (
                <SpaceTaskTile key={task.id} task={task} style={styles.taskTile} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColorGreyLight,
  },
  tasksContainer: {
    justifyContent: 'center',
    marginBottom: 30,
  },
  taskTile: {
    marginRight: 8,
  },
})

export default memo(SpaceDetails)
