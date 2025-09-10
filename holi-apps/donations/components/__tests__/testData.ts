import { Typesense_DocumentType } from '@holi/api/graphql/graphql-codegen'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { TypesenseDocument } from '@holi/core/typesense/types'

export const typesenseDonation: TypesenseDocument = {
  id: 'donation_123',
  type: Typesense_DocumentType.Donation,
  title_de: 'Deutscher Titel',
  title_en: 'English Title',
  description_de: 'Deutsche Beschreibung',
  description_en: 'English Description',
  summary_de: 'Deutsche Zusammenfassung',
  summary_en: 'English Summary',
  location: 'Berlin',
  location_country_de: 'Deutschland',
  location_country_en: 'Germany',
  location_lat_lng: [52.510819, 13.405479],
  image_url: 'https://example.com/donations/123.jpg',
  link_locators: {
    donation: '123',
  },
  topics_v2: ['animal-welfare', 'gender-equality'],
  skills_v2: ['it-technology', 'management-strategy'],
  source: 'Voltastics',
  organizer_name: 'Test Organization',
  organizer_image_url: 'https://example.com/donation/organizer_123.jpg',
  organizer_url: 'https://example.com/donation/organizer',
  organizer_location: 'Bern',
  organizer_location_country_de: 'Schweiz',
  organizer_location_country_en: 'Switzerland',
  external_url: 'https://example.com/donation/123',
  location_type: 'onsite',
  commitment_label: 'negotiable',
  commitment_duration: 'HOURS_1to2',
  donation_open_amount_in_cents: 1234567,
  donation_progress_percentage: 78,
}

export const localizedTypesenseDonation = localizeTypesenseDocument(typesenseDonation, 'en')
