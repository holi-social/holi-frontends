import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { Linking } from 'react-native'
import { Stack } from 'holi-bricks/components/stack'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Platform } from 'react-native'
import { white } from 'holi-bricks/tokens'
import { Button } from 'holi-bricks/components/button'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useEventDetailsData } from '@holi-apps/events/useEventDetailsData/useEventDetailsData'
import RenderHtml from 'react-native-render-html'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { ExternalLink } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'

export type EventDetailsParams = {
  eventId: string
}

const { useParam } = createParamHooks<EventDetailsParams>()

export const EventDetailsScreen = () => {
  const [eventId] = useParam('eventId')
  const { data, url: eventUrl, refetch } = useEventDetailsData(eventId as string)
  const { t } = useTranslation()
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
            <Button
              icon={ExternalLink}
              label={t('eventDetails.cta')}
              onPress={() => {
                Linking.openURL(eventUrl)
              }}
            />
          )}
        </Stack>
      }
    >
      <DetailsScreen
        {...data}
        description={
          <RenderHtml
            defaultTextProps={{ selectable: true }}
            source={{ html: data.description as string }}
            contentWidth={0}
          />
        }
      />
    </Screen>
  )
}
