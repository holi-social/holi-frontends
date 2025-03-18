import { useVolunteeringByIdQuery, useSimilarVolunteeringSliderQuery } from '@holi/api/graphql/graphql-codegen'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { DetailsScreenChips, DetailsScreenData, DetailsScreenInfoList } from '@holi/core/layouts/DetailsScreen'
import { MapPin2 } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import type { InfoModalItemProps } from '@holi/core/components/InfoModal'
import { useRateLimit } from '@holi/ui/helper'

export const VOLUNTEERING_IMG_SOURCES_MAPPING: {
  [name: string]: InfoModalItemProps
} = {
  Voltastics: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/voltastics-logo.png'),
      isSvg: false,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/voltastics-wordmark.png'),
      width: 159,
      height: 24,
      isSvg: false,
    },
    url: 'https://voltastics.com/',
  },
  'Aktion Mensch': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/aktion-mensch-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/aktion-mensch-wordmark.svg'),
      width: 60,
      height: 24,
      isSvg: true,
    },
    url: 'https://aktion-mensch.de/ueber-uns/die-aktion-mensch',
  },
  'vostel.de': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/vostel-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/vostel-wordmark.svg'),
      width: 71,
      height: 24,
      isSvg: true,
    },
    url: 'https://vostel.de/de/ueber_vostel',
  },
  GoNature: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/gonature-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/gonature-wordmark.svg'),
      width: 76,
      height: 24,
      isSvg: true,
    },
    url: 'https://gonature.de/ueber-uns',
  },
  GoVolunteer: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/govolunteer-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/govolunteer-wordmark.svg'),
      width: 119,
      height: 24,
      isSvg: true,
    },
    url: 'https://govolunteer.com/ueber-uns',
  },
  'German Volunteers': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/german-volunteers-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/german-volunteers-wordmark.svg'),
      width: 46,
      height: 24,
      isSvg: true,
    },
    url: 'https://germanvolunteers.de/uber-uns',
  },
}

export type UseVolunteeringDetailsData = {
  data: DetailsScreenData
}

export const useVolunteeringDetailsData = (volunteeringId?: string) => {
  const { replaceRoute } = useRouting()
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { data, loading, refetch } = useVolunteeringByIdQuery({
    variables: {
      id: volunteeringId as string,
    },
    skip: !volunteeringId,
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to load task', {
        location: 'EventDetails.volunteeringById',
        volunteeringId,
      })
    },
  })

  const {
    data: similarVolunteering,
    loading: similarVolunteeringLoading,
    refetch: similarVolunteeringRefetch,
  } = useSimilarVolunteeringSliderQuery({
    variables: {
      id: volunteeringId as string,
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    skip: !volunteeringId,
  })

  const refetchData = useRateLimit(async () => {
    if (volunteering?.id) {
      await refetch({ id: volunteering?.id })
      similarVolunteeringRefetch({ id: volunteering?.id })
    }
  })

  const volunteering = data?.appVolunteering_engagement
  const partner =
    volunteering && volunteering?.source ? VOLUNTEERING_IMG_SOURCES_MAPPING[volunteering.source] : undefined

  const skills =
    volunteering?.skillsV2?.map<DetailsScreenChips>((skill) => {
      return {
        title: skill,
        color: 'blue',
      }
    }) || []

  const topics =
    volunteering?.topicsV2?.map<DetailsScreenChips>((topic) => {
      return {
        title: topic,
        color: 'green',
      }
    }) || []

  const locationType = volunteering?.location
    ? {
        subtitle: volunteering?.location ? volunteering?.location : undefined,
        title: volunteering?.location ? volunteering?.location : t('task.locationType.NOT_DECLARED'),
        icon: MapPin2,
      }
    : undefined

  const infoList = [locationType].filter((detail) => detail !== undefined) as DetailsScreenInfoList[]
  return {
    refetch: async () => {
      await refetchData()
    },
    id: volunteering?.id,
    loading,
    url: data?.appVolunteering_engagement?.url,
    recommendations: similarVolunteering?.appVolunteering_similarRecommendations.data || [],
    recommendationsLoading: similarVolunteeringLoading,
    data: {
      loading,
      title: volunteering?.title || '',
      description: volunteering?.description,
      chips: [...topics, ...skills],
      visibility: 'public',
      infoList,
      coverImage: {
        uri: volunteering?.imageUrl,
      },
      author: {
        topTitle: `${t('postedVia', { source: volunteering?.source })}`,
        title: volunteering?.organizer?.name || volunteering?.source || '',
        mainAvatar: {
          source: partner?.logo?.src as string,
          initials: volunteering?.organizer?.name || '??',
        },
      },
    },
  }
}
