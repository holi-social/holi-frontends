import type { TFunction } from 'i18next'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import type { DetailsScreenChips, DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import { MapPin2 } from '@holi/icons/src/generated'
import {
  VOLUNTEERING_IMG_SOURCES_MAPPING,
  type VolunteeringDetailsScreenData,
} from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'

export const transformTypesenseDocument = (
  t: TFunction,
  language: string,
  document: TypesenseDocument
): VolunteeringDetailsScreenData => {
  const engagement = localizeTypesenseDocument(document, language)
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
        subtitle: undefined,
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
      label: document.organizer_name || '??',
    },
  }

  const infoList = [locationType].filter((detail) => detail !== undefined) as DetailsScreenInfoList[]

  return {
    title: engagement.title,
    description: engagement.description,
    chips: [...topics, ...skills],
    visibility: 'public',
    infoList,
    coverImage,
    author,
    externalUrl: document.external_url,
  }
}
