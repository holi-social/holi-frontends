import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { Linking } from 'react-native'
import { Stack } from 'holi-bricks/components/stack'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Platform, Pressable } from 'react-native'
import { white } from 'holi-bricks/foundations'
import { ButtonTracked } from '@holi/core/components/Trackable'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useEventDetailsData } from '@holi-apps/events/helpers/useEventDetailsData/useEventDetailsData'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { ExternalLink, Share } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { TrackingEvent } from '@holi/core/tracking'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'

export type EventDetailsParams = {
  eventId: string
}

const { useParam } = createParamHooks<EventDetailsParams>()

export const EventDetailsScreen = () => {
  const [eventId] = useParam('eventId')
  const { data, url: eventUrl, refetch, onShare } = useEventDetailsData(eventId as string)
  const { t } = useTranslation()

  useTrackOnce(TrackingEvent.EventDetails.viewed(eventId as string))

  return (
    <Screen
      onRefresh={refetch}
      preset="auto"
      statusBarProps={{
        barStyle: Platform.OS === 'ios' ? 'light-content' : 'default',
      }}
      headerOptions={{
        animation: 'slide_from_left',
        headerBackVisible: false,
        headerTitleAlign: 'center',
        ...Platform.select({
          native: {
            headerTintColor: white,
            title: '',
            headerTransparent: true,
          },
        }),
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        headerRight: ({ tintColor }) => (
          <Pressable onPress={() => onShare()}>
            <HoliIcon colorOverride={tintColor} size={24} icon={Share} />
          </Pressable>
        ),
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      StickyBottomComponent={
        <Stack
          padding={{ left: 'md', right: 'md', bottom: 'lg' }}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%"
        >
          {eventUrl && (
            <Stack width={'100%'} maxWidth="xs">
              <ButtonTracked
                icon={ExternalLink}
                label={t('eventDetails.cta')}
                onPress={() => {
                  Linking.openURL(eventUrl)
                }}
                trackingEvent={TrackingEvent.EventDetails.findMore}
              />
            </Stack>
          )}
        </Stack>
      }
    >
      <DetailsScreen {...data} />
    </Screen>
  )
}
