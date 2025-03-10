import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { DetailsScreen } from '@holi-apps/events/components/DetailsScreen'
import { Stack } from 'holi-bricks/components/stack'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Platform } from 'react-native'
import { white } from 'holi-bricks/tokens'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { Button } from 'holi-bricks/components/button'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useEventDetailsData } from '@holi-apps/events/useEventDetailsData/useEventDetailsData'

export type EventDetailsParams = {
  eventId: string
}

const { useParam } = createParamHooks<EventDetailsParams>()

export const EventDetailsScreen = () => {
  const [eventId] = useParam('eventId')
  const {
    data: { loading, title, coverImage, infoList, visibility, chips, author },
    refetch,
  } = useEventDetailsData(eventId as string)
  const displayCta = useFeatureFlag(FeatureFlagKey.TASK_CONTACT_CTA)

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
          {displayCta && <Button label="Contact" />}
        </Stack>
      }
    >
      <DetailsScreen
        loading={loading}
        coverImage={coverImage}
        title={title}
        infoList={infoList}
        visibility={visibility}
        description="test"
        // {
        //   <RenderHtml defaultTextProps={{ selectable: true }} source={{ html: description }} contentWidth={0} />
        // }
        author={author}
        chips={chips}
      />
    </Screen>
  )
}
