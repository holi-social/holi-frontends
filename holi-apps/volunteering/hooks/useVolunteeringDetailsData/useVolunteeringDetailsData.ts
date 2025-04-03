import { useVolunteeringByIdQuery, useSimilarVolunteeringSliderQuery } from '@holi/api/graphql/graphql-codegen'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { MapPin2 } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import type { DetailsScreenChips, DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

export const useVolunteeringDetailsData = (volunteeringId: string) => {
  const { replaceRoute } = useRouting()
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { data, loading, refetch } = useVolunteeringByIdQuery({
    variables: {
      id: volunteeringId,
    },
    skip: !volunteeringId,
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to volunteering opportunity', {
        location: 'useVolunteeringDetailsData',
        volunteeringId,
      })
    },
  })

  const {
    data: similarVolunteering,
    loading: similarVolunteeringLoading,
    refetch: similarVolunteeringRefetch,
  } = useSimilarVolunteeringSliderQuery({
    variables: { id: volunteeringId },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    skip: !volunteeringId,
  })

  useOnRefresh(() => {
    Promise.all([refetch(), similarVolunteeringRefetch({ id: volunteeringId })])
  })

  const volunteering = data?.appVolunteering_engagement
  const partner = volunteering?.source ? VOLUNTEERING_IMG_SOURCES_MAPPING[volunteering.source] : undefined

  const skills =
    volunteering?.skillsV2?.map<DetailsScreenChips>((skill) => {
      return {
        title: t('skill.' + skill),
        color: 'blue',
      }
    }) || []

  const topics =
    volunteering?.topicsV2?.map<DetailsScreenChips>((topic) => {
      return {
        title: t('topic.' + topic),
        color: 'green',
      }
    }) || []

  const locationType = volunteering?.location
    ? {
        subtitle: volunteering.location,
        title: volunteering.location,
        icon: MapPin2,
      }
    : undefined

  const coverImage = volunteering?.imageUrl
    ? {
        uri: volunteering?.imageUrl,
      }
    : undefined

  const author = {
    topTitle: `${t('postedVia', { source: volunteering?.source })}`,
    title: volunteering?.organizer?.name || volunteering?.source || '',
    mainAvatar: {
      source: volunteering?.organizer?.imageUrl ?? (partner?.logo?.src as string),
      initials: volunteering?.organizer?.name || '??',
    },
  }

  const infoList = [locationType].filter((detail) => detail !== undefined) as DetailsScreenInfoList[]

  return {
    isLoading: loading,
    recommendations: similarVolunteering?.appVolunteering_similarRecommendations.data || [],
    recommendationsLoading: similarVolunteeringLoading,
    document: {
      title: volunteering?.title || '',
      description: volunteering?.description,
      chips: [...topics, ...skills],
      visibility: 'public',
      infoList,
      coverImage,
      author,
      externalUrl: volunteering?.url,
    },
  }
}
