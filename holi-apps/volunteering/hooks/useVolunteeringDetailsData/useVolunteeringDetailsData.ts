import { useSimilarVolunteeringSliderQuery } from '@holi/api/graphql/graphql-codegen'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { DetailsScreenChips, DetailsScreenData, DetailsScreenInfoList } from '@holi/core/layouts/DetailsScreen'
import { MapPin2 } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import type { InfoModalItemProps } from '@holi/core/components/InfoModal'
import { useRateLimit } from '@holi/ui/helper'
import { createTypesenseClient } from '@holi/core/screens/search/helpers/createTypesenseClient'
import { useCallback, useEffect, useState } from 'react'
import type { SearchHitData } from '@holi/core/screens/search/types'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'

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
  refetch: () => Promise<void>
  id?: string
  loading: boolean
  url?: string
  recommendations: any[]
  recommendationsLoading: boolean
}

// Interface for the volunteering data structure
interface VolunteeringData {
  id?: string
  title?: string
  description?: string
  url?: string
  imageUrl?: string
  source?: string
  location?: string
  latitude?: number
  longitude?: number
  topicsV2?: Array<string>
  skillsV2?: Array<string>
  organizer?: {
    name?: string
    imageUrl?: string
  }
}

// Create a Typesense client
const typesenseClient = createTypesenseClient()

export const useVolunteeringDetailsData = (volunteeringId?: string): UseVolunteeringDetailsData => {
  const { replaceRoute } = useRouting()
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  
  // State to store the volunteering data
  const [volunteeringData, setVolunteeringData] = useState<VolunteeringData | null>(null)
  const [loading, setLoading] = useState(false)

  // Function to fetch volunteering data from Typesense
  const fetchVolunteeringData = useCallback(async (id: string) => {
    if (!id) return
    
    setLoading(true)
    try {
      // Search for the volunteering by ID
      const searchParams = {
        q: '*',
        filter_by: `id:=volunteering_${id} && type:=volunteering`,
        per_page: 1
      }
      
      const result = await typesenseClient.search(searchParams)
      
      if (result.hits && result.hits.length > 0) {
        const hit = result.hits[0] as SearchResponseHit<SearchHitData>
        const document = hit.document
        
        // Transform the Typesense document to match the expected structure
        const volunteering: VolunteeringData = {
          id: document.id,
          title: document.title_en || document.title_de,
          description: document.description_en || document.description_de,
          url: hit.document.link_locators?.volunteering as string,
          imageUrl: document.image_url,
          source: document.source as string,
          location: document.location,
          // Typesense stores location as [lat, lng] array
          latitude: document.location_lat_lng ? document.location_lat_lng[0] : undefined,
          longitude: document.location_lat_lng ? document.location_lat_lng[1] : undefined,
          topicsV2: document.topics_v2 as string[],
          skillsV2: document.skills_v2 as string[],
          // We don't have organizer data in Typesense, so we'll use source as name
          organizer: {
            name: document.source as string,
            imageUrl: undefined
          }
        }
        
        setVolunteeringData(volunteering)
      } else {
        // No results found, handle as 404
        replaceRoute('/404')
      }
    } catch (error) {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      displayError(error as Error, 'Failed to load task', {
        location: 'EventDetails.volunteeringById',
        volunteeringId: id,
      })
    } finally {
      setLoading(false)
    }
  }, [displayError, replaceRoute])

  // Fetch data when component mounts or volunteeringId changes
  useEffect(() => {
    if (volunteeringId) {
      fetchVolunteeringData(volunteeringId)
    }
  }, [volunteeringId, fetchVolunteeringData])

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
    if (volunteeringId) {
      await fetchVolunteeringData(volunteeringId)
      similarVolunteeringRefetch({ id: volunteeringId })
    }
  })

  const volunteering = volunteeringData
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
    url: volunteering?.url,
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
