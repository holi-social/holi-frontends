import { useCommittedVolunteering } from '@holi/core/screens/userprofile/hooks/useCommittedVolunteering'
import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'

jest.mock('@holi/api/graphql/graphql-codegen', () => ({
  VolunteeringOpportunityStatusValue: {
    ToDo: 'TO_DO',
    Contacted: 'CONTACTED',
    Doing: 'DOING',
  },
  useCommittedVolunteeringOpportunitiesQuery: jest.fn(),
  useTypesense_MultiSearchQuery: jest.fn(),
}))

const mockDisplayError = jest.fn()

jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: () => ({
    displayError: mockDisplayError,
  }),
}))

jest.mock('@holi/core/helpers/isSSR', () => ({
  isSSR: false,
}))

const {
  useCommittedVolunteeringOpportunitiesQuery,
  useTypesense_MultiSearchQuery,
} = require('@holi/api/graphql/graphql-codegen')

describe('useCommittedVolunteering', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDisplayError.mockClear()
    useCommittedVolunteeringOpportunitiesQuery.mockReturnValue(mockOkunaQuery)
    useTypesense_MultiSearchQuery.mockReturnValue(mockTypesenseQuery)
  })

  it('should signal inital loading state', () => {
    useCommittedVolunteeringOpportunitiesQuery.mockReturnValue({ loading: true })
    useTypesense_MultiSearchQuery.mockReturnValue({ loading: true })

    const { result } = renderHook(() => useCommittedVolunteering())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isInitialLoad).toBe(true)
  })

  it('should finally return items', async () => {
    const { result } = renderHook(() => useCommittedVolunteering())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isInitialLoad).toBe(false)
      expect(result.current.items).toHaveLength(3)

      expect(result.current.items[0].id).toEqual('181175')
      expect(result.current.items[0].type).toEqual('volunteering')
      expect(result.current.items[0].link).toEqual('/volunteering/181175')

      expect(result.current.items[1].id).toEqual('40ddaa0a-942c-4902-a983-f1b8b21719d2')
      expect(result.current.items[1].type).toEqual('volunteering')
      expect(result.current.items[1].link).toEqual('/volunteering/40ddaa0a-942c-4902-a983-f1b8b21719d2')

      expect(result.current.items[2].id).toEqual('ebfb0054-ced6-4bbb-b415-46cd873b6ae2')
      expect(result.current.items[2].type).toEqual('task')
      expect(result.current.items[2].link).toEqual('/spaces/new-space/tasks/ebfb0054-ced6-4bbb-b415-46cd873b6ae2')
    })
  })

  it('should handle errors', () => {
    useTypesense_MultiSearchQuery.mockReturnValue(mockOkunaErronousQuery)

    const { result } = renderHook(() => useCommittedVolunteering())
    expect(result.current.items).toEqual([])
    expect(result.current.hasError).toEqual(true)
    expect(mockDisplayError).toHaveBeenCalled()
    expect(mockDisplayError.mock.calls[0][0]).toStrictEqual(Error('broken'))
  })
})

const mockOkunaQuery = {
  data: {
    committedVolunteeringOpportunities: {
      data: [
        { status: 'TO_DO', externalVolunteeringOpportunityId: '181175' },
        { status: 'CONTACTED', externalVolunteeringOpportunityId: '40ddaa0a-942c-4902-a983-f1b8b21719d2' },
        { status: 'CONTACTED', externalVolunteeringOpportunityId: 'ebfb0054-ced6-4bbb-b415-46cd873b6ae2' },
      ],
      totalResults: 2,
    },
  },
  loading: false,
  error: undefined,
  refetch: jest.fn(),
}

const mockOkunaErronousQuery = {
  data: null,
  loading: false,
  error: new Error('broken'),
  refetch: jest.fn(),
}

const mockTypesenseQuery = {
  data: {
    typesense_multiSearch: {
      __typename: 'Typesense_MultiSearchResponse',
      results: [
        {
          __typename: 'Typesense_SearchResponseSuccess',
          found: 3,
          page: 1,
          hits: [
            {
              __typename: 'Typesense_SearchResponseHit',
              document: {
                __typename: 'Typesense_Document',
                type: 'volunteering',
                id: 'volunteering_181175',
                title_de: 'Übersetzer (ehrenamtlich)',
                title_en: null,
                description_de: '',
                description_en: null,
                location: 'Bundesweit',
                location_lat_lng: [51.163818359375, 10.447831153869629],
                image_url: 'https://backend.voltastics.de/search/image?id=181175-ubersetzer-ehrenamtlich',
                user_full_name: null,
                link_locators: {
                  __typename: 'Typesense_DocumentLinkLocators',
                  volunteering: '181175',
                  space: null,
                  task: null,
                  profile: null,
                  donation: null,
                },
                topics_v2: ['disaster-relief', 'human-rights', 'migration-refugees'],
                skills_v2: ['intercultural-competence', 'translation'],
                source: 'GoVolunteer',
                organizer_name: 'ShelterBox Germany e.V.',
                organizer_image_url:
                  'https://govolunteer-file-storage-prod.s3.amazonaws.com/organizer/profile/14572946_1543945568985749_7914814896033798123_n_iLWZ10u.png',
                organizer_url: null,
                organizer_location: null,
                organizer_location_country_de: null,
                organizer_location_country_en: null,
                external_url: 'https://govolunteer.com/projekte/ubersetzer-ehrenamtlich?utm_source=voltastics',
                commitment_label: 'negotiable',
                commitment_duration: 'MINUTES_30to60',
                location_type: 'remote',
                location_country_de: null,
                location_country_en: null,
                contact: [],
                summary_de: null,
                summary_en: null,
                donation_progress_percentage: null,
                donation_open_amount_in_cents: null,
              },
            },
            {
              __typename: 'Typesense_SearchResponseHit',
              document: {
                __typename: 'Typesense_Document',
                type: 'volunteering',
                id: 'volunteering_40ddaa0a-942c-4902-a983-f1b8b21719d2',
                title_de: 'NABU Stadtverband Münster e.V./Planen, Organisieren, Koordinieren',
                title_en: null,
                description_de:
                  '<p>Bei der Organisation eines großen Vereins wie dem NABU Münster mit mehr als 10 Arbeitsgruppen fallen in den Arbeitsgruppen und darüber hinaus viele Arbeiten an, oft organisatorischer / administrativer Art, die zur Erreichung der Ziele Naturschutz, Biotopschutz und Artenschutz erforderlich sind. Zum Beispiel</p>\n<ul>\n <li>\n <p>Informations- und Aktionsstand bei öffentlichen Veranstaltungen organisieren und besetzen</p>\n </li>\n <li>\n <p>einen Instagram-Kanal aufbauen und betreuen</p>\n </li>\n <li>\n <p>unsere eigenen Veranstaltungen organisieren</p>\n </li>\n <li>\n <p>unseren Internetauftritt pflegen</p>\n </li>\n <li>\n <p>oder die vielen Anfragen zu diversen Themen an Spezialist:innen weiterleiten oder beantworten.</p>\n </li>\n</ul>\n<p>Die zahlreichen administrativen Aufgaben werden aktuell von wenigen Personen im Vorstand, im erweiterten Vorstand und in den Arbeitsgruppen ehrenamtlich getragen, oft seit vielen Jahren. Ohne dieses ehrenamtliche Engagement kann unser Verein nicht existieren. Deshalb brauchen wir Eure Unterstützung. Jede und jeder Interessierte ist bei uns im Kreise der Aktiven willkommen, um sich in ihrem / seinem Metier und Interessenbereich ehrenamtlich einzubringen. Erfahrungen im Bereich Natur oder Naturschutz sind – wie unsere obigen Beispiele zeigen - nicht erforderlich! Wenn ihr Lust habt, einen Teil eurer Zeit – es kann auch eine Stunde in der Woche sein – bei der Verwirklichung der dem Gemeinwohl dienenden Ziele des NABU zu helfen, dann meldet Euch doch bitte direkt bei uns: buero@nabu-muenster.de</p>\n<p>Vieles kann heute auch von Zuhause aus erledigt werden. Wir bauen gerade Strukturen auf, die unsere interne Kommunikation erleichtern . Wir können dann voneinander lernen, uns ergänzen und dabei überhaupt wahrnehmen, dass wir eine recht große Gruppe von ähnlich denkenden und fühlenden Menschen sind. Bei unseren Treffen und Aktionen könnt Ihr ideal andere Aktive kennenlernen. </p>',
                description_en: null,
                location: null,
                location_lat_lng: null,
                image_url: 'https://freiwilligendatenbank.aktion-mensch.de/assets/img/angebote/angebotsbild-0121.jpg',
                user_full_name: null,
                link_locators: {
                  __typename: 'Typesense_DocumentLinkLocators',
                  volunteering: '40ddaa0a-942c-4902-a983-f1b8b21719d2',
                  space: null,
                  task: null,
                  profile: null,
                  donation: null,
                },
                topics_v2: ['animal-welfare', 'climate-environment'],
                skills_v2: [
                  'administration',
                  'creativity-design',
                  'event-planning',
                  'gardening-conservation',
                  'it-technology',
                  'marketing-communications',
                  'research-analysis',
                ],
                source: 'Aktion Mensch',
                organizer_name: 'NABU Stadtverband Münster e. V.',
                organizer_image_url: null,
                organizer_url: 'http://www.nabu-muenster.de',
                organizer_location: null,
                organizer_location_country_de: null,
                organizer_location_country_en: null,
                external_url:
                  'https://www.aktion-mensch.de/was-du-tun-kannst/ehrenamt/engagement-plattform#/lokale-angebote/40ddaa0a-942c-4902-a983-f1b8b21719d2',
                commitment_label: null,
                commitment_duration: 'MINUTES_30to60',
                location_type: 'remote',
                location_country_de: null,
                location_country_en: null,
                contact: [
                  {
                    __typename: 'Typesense_DocumentContact',
                    type: 'person',
                    value: 'Detlef Lobmeyer',
                    label: null,
                  },
                  {
                    __typename: 'Typesense_DocumentContact',
                    type: 'email',
                    value: 'buero@nabu-muenster.de',
                    label: null,
                  },
                  {
                    __typename: 'Typesense_DocumentContact',
                    type: 'phone',
                    value: '+49 251 136007',
                    label: null,
                  },
                  {
                    __typename: 'Typesense_DocumentContact',
                    type: 'website',
                    value: 'http://www.nabu-muenster.de',
                    label: 'NABU Stadtverband Münster e. V.',
                  },
                ],
                summary_de: null,
                summary_en: null,
                donation_progress_percentage: null,
                donation_open_amount_in_cents: null,
              },
            },
            {
              __typename: 'Typesense_SearchResponseHit',
              document: {
                __typename: 'Typesense_Document',
                type: 'task',
                id: 'task_ebfb0054-ced6-4bbb-b415-46cd873b6ae2',
                title_de:
                  'Test task with a long name so i can test the display of tasks with long titles that are longer than normal titles for tasks so i',
                title_en:
                  'Test task with a long name so i can test the display of tasks with long titles that are longer than normal titles for tasks so i',
                description_de:
                  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                description_en:
                  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                location: '',
                location_lat_lng: null,
                image_url: '',
                user_full_name: null,
                link_locators: {
                  __typename: 'Typesense_DocumentLinkLocators',
                  volunteering: null,
                  space: 'new-space',
                  task: 'ebfb0054-ced6-4bbb-b415-46cd873b6ae2',
                  profile: null,
                  donation: null,
                },
                topics_v2: ['democracy-politics', 'animal-welfare', 'food-hunger-relief', 'literacy-education'],
                skills_v2: [],
                source: null,
                organizer_name: 'New space',
                organizer_image_url: '',
                organizer_url: null,
                organizer_location: null,
                organizer_location_country_de: null,
                organizer_location_country_en: null,
                external_url: null,
                commitment_label: 'recurring',
                commitment_duration: null,
                location_type: 'remote',
                location_country_de: null,
                location_country_en: null,
                contact: null,
                summary_de: null,
                summary_en: null,
                donation_progress_percentage: null,
                donation_open_amount_in_cents: null,
              },
            },
          ],
          facet_counts: [],
        },
      ],
    },
    loading: false,
    error: undefined,
    refetch: jest.fn(),
  },
}
