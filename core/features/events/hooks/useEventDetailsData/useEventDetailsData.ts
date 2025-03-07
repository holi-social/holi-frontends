import type { DetailsScreenData } from '@holi/core/layouts/DetailsScreen'
import { useTranslation } from 'react-i18next'

export type UseEventDetailsData = {
  data: DetailsScreenData
  id?: string
  spaceName?: string
  isOwner?: boolean
  refetch(): Promise<void>
  spaceId?: string
  spaceTitle?: string
}

export const useEventDetailsData = (eventId?: string): UseEventDetailsData => {
  // const { displayError } = useErrorHandling()
  // const { replaceRoute } = useRouting()
  const { t } = useTranslation()

  return {
    refetch: async () => {},
    id: eventId || '1',
    data: {
      loading: false,
      title: 'title',
      description: 'description',
      chips: [],
      visibility: 'public',
      infoList: [],
      coverImage: { uri: '' },
      author: {
        topTitle: `${new Date()} ∙ ${t('postedOnHoli')}`,
        title: 'Author title',
        subtitle: 'subtitle',
        mainAvatar: {
          imgSrc: '',
          initials: '??',
        },
      },
    },
  }
}
