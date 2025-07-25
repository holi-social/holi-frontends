import {
  type Typesense_Document,
  Typesense_DocumentType,
  type Typesense_SearchResponseHit,
} from '@holi/api/graphql/graphql-codegen'
import type { TypesensePaginationState } from '@holi/core/typesense/hooks/useTypesensePaginationMultiQuery'

export const createHits = (length: number): Typesense_SearchResponseHit[] =>
  Array.from({ length }, (_, i) => {
    const document: Typesense_Document = {
      __typename: 'Typesense_Document',
      id: i.toString(),
      type: Typesense_DocumentType.Volunteering,
      description_de: '',
      description_en: '',
      external_url: '',
      image_url: '',
      link_locators: {
        __typename: 'Typesense_DocumentLinkLocators',
        volunteering: i.toString(),
        profile: '',
        space: '',
        task: '',
      },
      location: '',
      location_lat_lng: [1, 2],
      organizer_image_url: '',
      organizer_name: '',
      organizer_url: '',
      skills_v2: [],
      source: '',
      title_de: '',
      title_en: '',
      topics_v2: [],
      user_full_name: '',
      commitment_duration: '',
      commitment_label: '',
      location_type: '',
      contact: [],
    }
    return {
      __typename: 'Typesense_SearchResponseHit',
      document,
      highlight: undefined,
    }
  })

export const testState: TypesensePaginationState = {
  hits: createHits(10),
  totalNrOfPages: 13,
  totalResults: 123,
  canFetchMore: true,
  currentPage: 1,
  parameters: {},
  facetCounts: {},
}
