import { Typesense_DocumentType } from '@holi/api/graphql/graphql-codegen'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

export const localizedTypesenseDonation: LocalizedTypesenseDocument = {
  id: 'donation_123',
  type: Typesense_DocumentType.Donation,
  title: 'Title',
  description: 'Description',
  location: 'Hamburg',
  location_country: 'Germany',
  organizer_location: 'Bern',
  organizer_location_country: 'Switzerland',
  organizer_name: 'Test Initiative',
  organizer_url: 'https://www.test-initiative.ch',
  donation_open_amount_in_cents: 1234567,
  donation_progress_percentage: 78,
}
