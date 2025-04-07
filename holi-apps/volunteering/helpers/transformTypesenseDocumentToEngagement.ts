import type { VolunteeringEngagement } from '@holi-apps/volunteering/types'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'

export const getTitle = (language: string, document: TypesenseDocument): string => {
  if (document.title_en && (language === 'en' || !document.title_de)) {
    return document.title_en
  }
  return document.title_de ?? ''
}

export const getDescription = (language: string, document: TypesenseDocument): string => {
  if (document.description_en && (language === 'en' || !document.description_de)) {
    return document.description_en
  }
  return document.description_de ?? ''
}

export const transformTypesenseDocumentToEngagement = (
  hit: SearchResponseHit<TypesenseDocument>,
  language: string
): VolunteeringEngagement => {
  const document = hit.document
  return {
    id: document.id,
    title: getTitle(language, document),
    description: getDescription(language, document),
    url: document.external_url ?? '',
    source: document.source ?? '',
    organizer: {
      name: document.organizer_name,
      imageUrl: document.organizer_image_url,
    },
    imageUrl: document.image_url,
    location: document.location,
    skillsV2: document.skills_v2,
    topicsV2: document.topics_v2,
  }
}
