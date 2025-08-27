import { Typesense_DocumentContactType } from '@holi/api/graphql/graphql-codegen'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'

export const volunteeringDetailsScreenData: VolunteeringDetailsScreenData = {
  title: 'Some title',
  externalUrl: 'https://www.lovelace.com',
  contact: [
    { type: Typesense_DocumentContactType.Person, value: 'Ada Lovelace' },
    { type: Typesense_DocumentContactType.Email, value: 'ada@lovelace.com' },
    { type: Typesense_DocumentContactType.Phone, value: '+49 1234 1234567' },
    {
      label: "Ada's Website",
      type: Typesense_DocumentContactType.Website,
      value: 'https://www.lovelace.com',
    },
  ],
  commitmentType: 'once',
  status: null,
}
