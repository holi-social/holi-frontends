import { useTranslation } from 'react-i18next'
import { useGetEventByIdQuery } from '@holi/api/graphql/graphql-codegen'
import { CalendarEvent, MapPin2, VideoChat } from '@holi/icons/src/generated'
import type { DetailsScreenData, DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import { isSSR } from '@holi/core/helpers/isSSR'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { Linking } from 'react-native'
import type { ImageSource } from 'holi-bricks/components/image'
import { useRateLimit } from '@holi/ui/helper'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { TrackingEvent } from '@holi/core/tracking'
import { EVENTS_SOURCE_MAPPING } from '@holi-apps/events/helpers/eventsSourceMapping'
import { getFormattedEventDates } from '@holi/core/i18n/helpers/dateHelper'

export type UseEventDetailsData = {
  data: DetailsScreenData
  id?: string
  url?: string
  spaceName?: string
  isOwner?: boolean
  refetch(): Promise<void>
  onShare(): Promise<void>
  spaceId?: string
  spaceTitle?: string
}

export const useEventDetailsData = (eventId?: string): UseEventDetailsData => {
  const { displayError } = useErrorHandling()
  const { replaceRoute } = useRouting()
  const { track } = useTracking()
  const { data, loading, refetch } = useGetEventByIdQuery({
    variables: {
      id: eventId as string,
    },
    skip: !eventId,
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to load event', {
        location: 'EventDetails.eventByIdQuery',
        eventId,
      })
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation()

  const event = data?.appEvents_event?.data
  const formattedDates = getFormattedEventDates(event?.startDate, event?.endDate, i18n.language) as string
  const [, shareLink] = useShareLink({
    link: `/events/${eventId}`,
    linkType: LinkType.UNIVERSAL,
    message: `${event?.title} ${formattedDates && '- ' + formattedDates} ${event?.location && ' - ' + event.location}`,
  })

  const addressParts = [
    event?.location?.street,
    event?.location?.streetNo,
    event?.location?.zipCode,
    event?.location?.city,
  ].filter(Boolean)

  const fullAddress = addressParts.length > 0 ? addressParts.join(' ') : undefined

  const organizationName = event?.organisationName ?? event?.title ?? t('act.events.detail.organisationNameFallback')

  const eventDates = formattedDates ? { title: formattedDates, icon: CalendarEvent } : undefined
  const infoList: DetailsScreenInfoList[] = [
    { title: organizationName, subtitle: fullAddress || undefined, icon: MapPin2 },
  ]

  if (eventDates) {
    infoList.push(eventDates)
  }

  if (event?.isRemote) {
    const remoteLink = event.eventDetails.meetingLink ?? event.eventDetails.meetingLink ?? ''
    infoList.push({
      title: remoteLink,
      icon: VideoChat,
      showExternalIcon: true,
      onPress: () => {
        track(TrackingEvent.EventDetails.videoCall(event?.id as string))
        Linking.openURL(remoteLink)
      },
    })
  }

  const refetchData = useRateLimit(() => refetch({ id: eventId }))

  const onShare = async () => {
    if ((await shareLink()) === 'shared') {
      track(TrackingEvent.EventDetails.shared(event?.id as string))
    }
  }
  const partner = EVENTS_SOURCE_MAPPING?.['Gemeinschaftswerk Nachhaltigkeit']

  return {
    refetch: async () => {
      await refetchData()
    },
    onShare,
    id: event?.id,
    url: event?.eventDetails?.externalLink,
    data: {
      visibility: 'public',
      loading: loading,
      title: event?.title ?? '',
      description: event?.eventDetails.description || '',
      infoList,
      coverImage: { uri: event?.imageUrl },
      date: event?.startDate ? event?.startDate : undefined,
      partners: {
        title: t('eventDetails.partnersTitle'),
        details: [
          {
            title: partner.text as string,
            image: partner?.logo?.src as ImageSource,
            onPress: () => {
              if (partner?.url) Linking.openURL(partner?.url)
            },
          },
        ],
      },
      author: {
        topTitle: 'posted via Gemeinschaftswerk Nachhaltigkeit',
        title: organizationName,
        mainAvatar: {
          source: EVENTS_SOURCE_MAPPING?.['Gemeinschaftswerk Nachhaltigkeit'].logo?.src as ImageSource,
          initials: organizationName,
        },
      },
    },
  }
}
