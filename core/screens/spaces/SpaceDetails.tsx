import { useQuery } from '@apollo/client'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { Task } from './types.ts'

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
      <View style={[mixins.container, { justifyContent: 'center', padding: 10 }]}>
        <HoliHeading level="1">{space.title}</HoliHeading>
        <HoliText style={{ paddingTop: 10 }}>
          <Trans i18nKey="spaces.spaceDetails.creator" values={{ name: creator.fullName || t('Anonymous user') }} />
        </HoliText>
        <HoliText style={{ paddingTop: 10 }}>{space.description}</HoliText>
        <HoliHeading level="2">{space.tasks.length} ways to act</HoliHeading>
        <ScrollView horizontal={true} style={{ marginTop: 20 }} contentContainerStyle={styles.appsCarousel}>
          {space.tasks.map((task: Task) => (
            <View key={task.id} style={[styles.taskItem]}>
              <HoliText>{task.name}</HoliText>
              <HoliUserAvatar
                imageSrc={task.creator.avatar}
                label={userFullName(task.creator) || t('spaces.tasks.creator.anonymous')}
                initials={task.creator.avatarLabel}
                defaultColor={task.creator.avatarDefaultColor}
                size="micro"
              />
              <HoliText>
                {task.location} | {t(`spaces.tasks.regularity.${task.regularity}`)}
              </HoliText>
              <HoliText>{task.description}</HoliText>
              <HoliButton
                label={t('spaces.tasks.cta_details')}
                onPress={() => ({})} // TODO add action
                testID={`spaces-tasks-cta-details-${task.id}`}
                transparent
                inline
              >
                <HoliText>{t('spaces.tasks.cta_details')}</HoliText>
              </HoliButton>
              <HoliButton
                label={t('spaces.tasks.cta_claim')}
                onPress={() => ({})} // TODO add action
                testID={`spaces-tasks-cta-claim-${task.id}`}
                inline
              >
                <HoliText>{t('spaces.tasks.cta_claim')}</HoliText>
              </HoliButton>
              <HoliText>
                {t('spaces.tasks.spots_claimed', { taken: task.slotsTaken, available: task.slotsAvailable })}
              </HoliText>
            </View>
          ))}
        </ScrollView>
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  taskItem: {
    paddingTop: 12,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
    backgroundColor: colors.backgroundColorGreyLight,
    marginRight: 10,
  },
  appsCarousel: {
    justifyContent: 'center',
    marginBottom: 30,
  },
})

export default SpaceDetails
