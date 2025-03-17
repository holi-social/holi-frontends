import type { DetailsScreenData } from '@holi-apps/events/components/DetailsScreen'
import { useTranslation } from 'react-i18next'
import { useAllEventsQuery } from '@holi/api/graphql/graphql-codegen'
import { CalendarEvent, MapPin2, VideoChat } from '@holi/icons/src/generated'
import { localizeDate } from '@holi/ui/helper/date'

interface NormalizedData extends DetailsScreenData {
  description: string
}

export type UseEventDetailsData = {
  data: NormalizedData
  id?: string
  spaceName?: string
  isOwner?: boolean
  refetch(): Promise<void>
  spaceId?: string
  spaceTitle?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useEventDetailsData = (eventId?: string): UseEventDetailsData => {
  // const { displayError } = useErrorHandling()
  // const { replaceRoute } = useRouting()
  //todo gregor: build by id fetching backend capabilities
  const { data, loading } = useAllEventsQuery({
    variables: { limit: 10, offset: 0 },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation()

  const event = data?.appEvents_events?.data?.[0]

  const fullAddress = `${event?.location?.street} ${event?.location?.streetNo}, ${event?.location?.zipCode} ${event?.location?.city}`

  const dateTimeFormat: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  //todo gregor: utc? timezones? the fun bits?
  const startDate = event?.startDate ? localizeDate(new Date(event?.startDate), 'de', dateTimeFormat) : ''
  const endDate = event?.endDate ? localizeDate(new Date(event.endDate), 'de', dateTimeFormat) : ''

  //todo gregor: translate
  const organizationName = event?.organisationName ?? event?.title ?? 'Eine externe Initiative'

  const infoList = [
    { title: organizationName, subtitle: fullAddress, icon: MapPin2 },
    { title: startDate + ' - ' + endDate, icon: CalendarEvent },
  ]

  if (event?.isRemote) {
    const remoteLink = event.eventDetails.meetingLink ?? event.eventDetails.meetingLink ?? ''
    infoList.push({ title: remoteLink, icon: VideoChat })
  }

  return {
    refetch: async () => {},
    id: event?.id,
    data: {
      loading: loading,
      title: event?.title ?? '',
      //todo gregor: make this output html in a safe way
      description: event?.eventDetails.description || '',
      infoList,
      coverImage: { uri: event?.imageUrl },
      author: {
        topTitle: 'posted via Gemeinschaftswerk Nachhaltigkeit',
        title: organizationName,
        mainAvatar: {
          // imgSrc: '',
          initials: '??',
        },
      },
    },
  }
}
