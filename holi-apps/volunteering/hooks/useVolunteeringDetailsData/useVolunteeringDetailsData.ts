import { useSimilarVolunteeringSliderQuery } from '@holi/api/graphql/graphql-codegen'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { MapPin2 } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { InfoModalItemProps } from '@holi/core/components/InfoModal'
import type { DetailsScreenChips, DetailsScreenData, DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import type { TypesenseDocument } from '@holi/core/typesense/types'

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

const getTitle = (language: string, document: TypesenseDocument): string => {
  if (document.title_en && (language === 'en' || !document.title_de)) {
    return document.title_en
  }
  return document.title_de ?? ''
}

const getDescription = (language: string, document: TypesenseDocument): string => {
  if (document.description_en && (language === 'en' || !document.description_de)) {
    return document.description_en
  }
  return document.description_de ?? ''
}

const transformDocument = (
  t: TFunction,
  language: string,
  document: TypesenseDocument
): DetailsScreenData & { externalUrl?: string } => {
  const partner = document.source ? VOLUNTEERING_IMG_SOURCES_MAPPING[document.source] : undefined

  const skills =
    document.skills_v2?.map<DetailsScreenChips>((skill) => {
      return {
        title: t('skill.' + skill),
        color: 'blue',
      }
    }) || []

  const topics =
    document.topics_v2?.map<DetailsScreenChips>((topic) => {
      return {
        title: t('topic.' + topic),
        color: 'green',
      }
    }) || []

  const locationType = document.location
    ? {
        subtitle: document.location,
        title: document.location,
        icon: MapPin2,
      }
    : undefined

  const coverImage = document.image_url
    ? {
        uri: document.image_url,
      }
    : undefined

  const author = {
    topTitle: `${t('postedVia', { source: document.source })}`,
    title: document.organizer_name || document.source || '',
    mainAvatar: {
      source: document.organizer_image_url ?? (partner?.logo?.src as string),
      initials: document.organizer_name || '??',
    },
  }

  const infoList = [locationType].filter((detail) => detail !== undefined) as DetailsScreenInfoList[]

  return {
    title: getTitle(language, document),
    description: getDescription(language, document),
    chips: [...topics, ...skills],
    visibility: 'public',
    infoList,
    coverImage,
    author,
    externalUrl: document.external_url,
  }
}

export const useVolunteeringDetailsData = (volunteeringId: string) => {
  const { replaceRoute } = useRouting()
  const { t, i18n } = useTranslation()
  const { displayError } = useErrorHandling()

  const { isLoading, document, refresh } = useSingleTypesenseDocumentQuery(volunteeringId, 'volunteering', {
    onError: (error) => {
      displayError(error, 'Failed to load volunteering opportunity', {
        location: 'useVolunteeringDetailsData',
        volunteeringId,
      })
    },
    onNotFound: () => {
      return replaceRoute('/404')
    },
  })

  const {
    data: similarVolunteering,
    loading: similarVolunteeringLoading,
    refetch: similarVolunteeringRefetch,
  } = useSimilarVolunteeringSliderQuery({
    variables: {
      id: volunteeringId,
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    skip: !volunteeringId,
  })

  useOnRefresh(() => {
    Promise.all([refresh(), similarVolunteeringRefetch({ id: volunteeringId })])
  })

  return {
    isLoading,
    document: document ? transformDocument(t, i18n.language, document) : undefined,
    recommendations: similarVolunteering?.appVolunteering_similarRecommendations.data || [],
    recommendationsLoading: similarVolunteeringLoading,
  }
}
