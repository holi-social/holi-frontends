import { useTranslation } from 'react-i18next'
import { useGetEventByIdQuery } from '@holi/api/graphql/graphql-codegen'
import { CalendarEvent, MapPin2, VideoChat } from '@holi/icons/src/generated'
import { localizeDate } from '@holi/ui/helper/date'
import type { DetailsScreenData, DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import { isSSR } from '@holi/core/helpers/isSSR'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { Linking } from 'react-native'

export type UseEventDetailsData = {
  data: DetailsScreenData
  id?: string
  url?: string
  spaceName?: string
  isOwner?: boolean
  refetch(): Promise<void>
  spaceId?: string
  spaceTitle?: string
}

export const useEventDetailsData = (eventId?: string): UseEventDetailsData => {
  const { displayError } = useErrorHandling()
  const { replaceRoute } = useRouting()
  const { data, loading } = useGetEventByIdQuery({
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

  const addressParts = [
    event?.location?.street,
    event?.location?.streetNo,
    event?.location?.zipCode,
    event?.location?.city,
  ].filter(Boolean)

  const fullAddress = addressParts.length > 0 ? addressParts.join(' ') : undefined

  const dateTimeFormat: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  const startDate = event?.startDate ? localizeDate(new Date(event?.startDate), i18n.language, dateTimeFormat) : ''
  const endDate = event?.endDate ? localizeDate(new Date(event.endDate), i18n.language, dateTimeFormat) : ''

  const organizationName = event?.organisationName ?? event?.title ?? 'Eine externe Initiative'
  const infoList: DetailsScreenInfoList[] = [
    { title: organizationName, subtitle: fullAddress || undefined, icon: MapPin2 },
    { title: startDate + ' - ' + endDate, icon: CalendarEvent },
  ]

  if (event?.isRemote) {
    const remoteLink = event.eventDetails.meetingLink ?? event.eventDetails.meetingLink ?? ''
    infoList.push({
      title: remoteLink,
      icon: VideoChat,
      showExternalIcon: true,
      onPress: () => Linking.openURL(remoteLink),
    })
  }

  return {
    refetch: async () => {},
    id: event?.id,
    url: event?.eventDetails?.externalLink,
    data: {
      visibility: 'public',
      loading: loading,
      title: event?.title ?? '',
      description: event?.eventDetails.description || '',
      infoList,
      coverImage: { uri: event?.imageUrl },
      date: event?.startDate ? new Date(event?.startDate) : undefined,
      author: {
        topTitle: 'posted via Gemeinschaftswerk Nachhaltigkeit',
        title: organizationName,
        mainAvatar: {
          initials: organizationName,
        },
      },
    },
  }
}
