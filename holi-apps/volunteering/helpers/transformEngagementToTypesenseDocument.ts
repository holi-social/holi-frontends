import type { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'
import { TypesenseDocumentType, type TypesenseDocument } from '@holi/core/typesense/types'

export const transformEngagementToTypesenseDocument = (
  engagementOrReco: VolunteeringEngagement | VolunteeringReco
): TypesenseDocument => {
  const isReco = 'engagement' in engagementOrReco
  const engagement = isReco ? engagementOrReco.engagement : engagementOrReco

  return {
    type: TypesenseDocumentType.Volunteering,
    id: `volunteering_${engagement.id}`,
    title_de: engagement.title,
    title_en: engagement.title,
    description_de: engagement.description,
    description_en: engagement.description,
    external_url: engagement.url,
    source: engagement.source,
    organizer_name: engagement.organizer?.name,
    organizer_image_url: engagement.organizer?.imageUrl,
    image_url: engagement.imageUrl,
    location: engagement.location,
    location_lat_lng:
      engagement.latitude && engagement.longitude ? [engagement.latitude, engagement.longitude] : undefined,
    skills_v2: isReco ? engagementOrReco.matchedSkillsV2 : engagement.skillsV2,
    topics_v2: isReco ? engagementOrReco.matchedTopicsV2 : engagement.topicsV2,
    link_locators: {
      volunteering: engagement.id,
    },
  }
}
