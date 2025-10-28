import type { TFunction } from 'i18next'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import type { DetailsScreenChips, DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import { AiEstimatedTime, Global, Globe, MapPin2, Refresh } from '@holi/icons/src/generated'
import {
  VOLUNTEERING_IMG_SOURCES_MAPPING,
  type VolunteeringDetailsScreenData,
} from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { MultiPlatformImageSource } from 'holi-bricks/components/image'
import {
  Typesense_DocumentContactType,
  type VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'
import { logError } from '@holi/core/errors/helpers'

interface TransformTypesenseDocumentProps {
  t: TFunction
  language: string
  document: TypesenseDocument
  onOpenLink: (url?: string) => void
  status: VolunteeringOpportunityStatusValue | null
}

const parseUrl = (url?: string): URL | undefined => {
  if (!url) {
    return undefined
  }
  try {
    const protocolPrefix = url.startsWith('http') ? '' : 'https://'
    return new URL(protocolPrefix + url)
  } catch (e) {
    logError(e, 'Invalid URL', {
      location: 'transformTypesenseDocument.parseUrl',
      url,
    })
    return undefined
  }
}

export const transformTypesenseDocument = ({
  t,
  language,
  document,
  onOpenLink,
  status,
}: TransformTypesenseDocumentProps): VolunteeringDetailsScreenData => {
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

  const isRemote = document.location_type === 'remote'
  const locationInfo = isRemote
    ? {
        icon: Global,
        title: t('volunteering.engagement.location_type.remote'),
      }
    : document.location
      ? {
          title: document.location,
          icon: MapPin2,
        }
      : undefined

  const commitmentRegularity = engagement.commitment_label
    ? {
        icon: Refresh,
        title: t(`volunteering.engagement.commitment_label.${engagement.commitment_label}`),
      }
    : undefined
  const commitmentDuration =
    engagement.commitment_duration && engagement.commitment_duration !== 'INDETERMINATE'
      ? {
          icon: AiEstimatedTime,
          title: t(`volunteering.engagement.commitment_duration.${engagement.commitment_duration}`),
          subtitle: t('volunteeringDetails.timeAI'),
          subtitleColor: 'informative',
        }
      : undefined

  const websiteUrl =
    engagement.contact?.find((contact) => contact.type === Typesense_DocumentContactType.Website)?.value ??
    document.external_url
  const externalUrl = parseUrl(websiteUrl)
  const externalWebsite = externalUrl
    ? {
        icon: Globe,
        title: externalUrl?.hostname,
        onPress: () => onOpenLink(externalUrl.toString()),
        showExternalIcon: true,
      }
    : undefined

  const coverImage = document.image_url
    ? {
        uri: document.image_url,
      }
    : undefined

  const organizerUrl = parseUrl(document.organizer_url)
  const author = {
    topTitle: `${t('postedVia', { source: document.source })}`,
    title: document.organizer_name || document.source || '',
    mainAvatar: {
      source: document.organizer_image_url,
      label: document.organizer_name || '??',
    },
    isExternalLink: !!organizerUrl,
    onPress: organizerUrl ? () => onOpenLink(organizerUrl.toString()) : undefined,
  }

  const infoList = [locationInfo, commitmentRegularity, commitmentDuration, externalWebsite].filter(
    (detail) => detail !== undefined
  ) as DetailsScreenInfoList[]

  return {
    title: engagement.title,
    bodyContent: { content: engagement.description },
    chips: [...topics, ...skills],
    visibility: 'public',
    infoList,
    coverImage,
    author,
    externalUrl: document.external_url,
    commitmentType: document.commitment_label,
    locationType: document.location_type,
    source: document.source,
    contact: engagement.contact,
    status,
    partners: {
      title: t('volunteering.engagementDetail.providedBy'),
      details: [
        {
          title: document.source ?? '',
          image: partner?.logo?.src as MultiPlatformImageSource,
          onPress: document.external_url ? () => onOpenLink(document.external_url) : undefined,
        },
      ],
    },
  }
}
