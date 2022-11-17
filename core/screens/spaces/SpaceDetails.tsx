import { useQuery } from '@apollo/client'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
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

const SpaceDetails: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [spaceId] = useParam('spaceId')

  const { t } = useTranslation()
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, { title: 'Space Details', headerLeft: () => <BackButton /> })

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
    <DefaultLayout>
      <View style={[mixins.container, { justifyContent: 'center', padding: 24 }]}>
        <HoliHeading level="1">{space.title}</HoliHeading>
        <HoliText style={{ paddingTop: 10 }}>
          <Trans i18nKey="spaces.spaceDetails.creator" values={{ name: creator.fullName || t('Anonymous user') }} />
        </HoliText>
        <HoliText style={{ paddingTop: 10 }}>{space.description}</HoliText>
        {space.tasks && space.tasks.length > 0 && (
          <View>
            <HoliHeading level="2">{t('spaces.spaceDetails.tasksHeading', { count: space.tasks.length })}</HoliHeading>
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

export default SpaceDetails
