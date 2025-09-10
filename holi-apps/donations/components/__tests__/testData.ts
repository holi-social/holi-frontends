import { Typesense_DocumentType } from '@holi/api/graphql/graphql-codegen'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { TypesenseDocument } from '@holi/core/typesense/types'

const createTypesenseDonation = (id: number): TypesenseDocument => ({
  id: `donation_${id}`,
  type: Typesense_DocumentType.Donation,
  title_de: `Deutscher Titel ${id}`,
  title_en: `English Title ${id}`,
  description_de: 'Deutsche Beschreibung',
  description_en: 'English Description',
  summary_de: 'Deutsche Zusammenfassung',
  summary_en: 'English Summary',
  location: 'Berlin',
  location_country_de: 'Deutschland',
  location_country_en: 'Germany',
  location_lat_lng: [52.510819, 13.405479],
  image_url: `https://example.com/donations/${id}.jpg`,
  link_locators: {
    donation: id.toString(),
  },
  topics_v2: ['animal-welfare', 'gender-equality'],
  skills_v2: ['it-technology', 'management-strategy'],
  source: 'Voltastics',
  organizer_name: 'Test Organization',
  organizer_image_url: `https://example.com/donation/organizer_${id}.jpg`,
  organizer_url: 'https://example.com/donation/organizer',
  organizer_location: 'Bern',
  organizer_location_country_de: 'Schweiz',
  organizer_location_country_en: 'Switzerland',
  external_url: `https://example.com/donation/${id}`,
  location_type: 'onsite',
  commitment_label: 'negotiable',
  commitment_duration: 'HOURS_1to2',
  donation_open_amount_in_cents: 1234567,
  donation_progress_percentage: 78,
})

export const createTypesenseDonations = (length: number) =>
  Array.from({ length }, (_, index) => createTypesenseDonation(index))

const createLocalizedDonation = (id: number, language: string) =>
  localizeTypesenseDocument(createTypesenseDonation(id), language)

export const createLocalizedDonations = (length: number, language = 'en') =>
  Array.from({ length }, (_, index) => createLocalizedDonation(index, language))

export const typesenseDonation = createTypesenseDonation(123)

export const localizedTypesenseDonation = localizeTypesenseDocument(typesenseDonation, 'en')
