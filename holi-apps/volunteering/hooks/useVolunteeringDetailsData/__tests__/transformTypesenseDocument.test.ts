import { transformTypesenseDocument } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformTypesenseDocument'
import { Typesense_DocumentContactType } from '@holi/api/graphql/graphql-codegen'
import { type TypesenseDocument, TypesenseDocumentType } from '@holi/core/typesense/types'
import { AiEstimatedTime, Global, Globe, MapPin2, Refresh } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('transformDocument', () => {
  // Test data setup
  const baseDocument: TypesenseDocument = {
    type: TypesenseDocumentType.Volunteering,
    id: 'test-id-123',
    title_de: 'Deutscher Titel',
    title_en: 'English Title',
    description_de: 'Deutsche Beschreibung',
    description_en: 'English Description',
    source: 'Voltastics',
    location: 'Berlin, Germany',
    topics_v2: ['animal-welfare', 'gender-equality'],
    skills_v2: ['it-technology', 'management-strategy'],
    organizer_name: 'Test Organization',
    organizer_image_url: 'https://example.com/organizer/image.jpg',
    organizer_url: 'https://example.com/organizer',
    external_url: 'https://example.com/volunteering',
    commitment_label: 'recurring',
    commitment_duration: 'HOURS_1to2',
    location_type: 'onsite',
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
  }

  it('should transform a document with all fields correctly', () => {
    const { t } = useTranslation()
    const onOpenLink = jest.fn()
    const result = transformTypesenseDocument({ t, language: 'en', document: baseDocument, onOpenLink, status: null })

    expect(result).toEqual({
      title: 'English Title',
      bodyContent: { content: 'English Description' },
      chips: [
        { title: 'topic.animal-welfare', color: 'green' },
        { title: 'topic.gender-equality', color: 'green' },
        { title: 'skill.it-technology', color: 'blue' },
        { title: 'skill.management-strategy', color: 'blue' },
      ],
      visibility: 'public',
      infoList: [
        {
          title: 'Berlin, Germany',
          icon: MapPin2,
          subtitle: undefined,
        },
        {
          title: 'volunteering.engagement.commitment_label.recurring',
          icon: Refresh,
        },
        {
          icon: AiEstimatedTime,
          subtitle: 'volunteeringDetails.timeAI',
          subtitleColor: 'informative',
          title: 'volunteering.engagement.commitment_duration.HOURS_1to2',
        },
        {
          icon: Globe,
          title: 'www.lovelace.com',
          onPress: expect.any(Function),
          showExternalIcon: true,
        },
      ],
      coverImage: undefined,
      author: {
        topTitle: 'postedVia',
        title: 'Test Organization',
        mainAvatar: {
          label: 'Test Organization',
          source: 'https://example.com/organizer/image.jpg',
        },
        isExternalLink: true,
        onPress: expect.any(Function),
      },
      externalUrl: 'https://example.com/volunteering',
      location: 'Berlin, Germany',
      locationType: 'onsite',
      commitmentType: 'recurring',
      source: 'Voltastics',
      contact: baseDocument.contact,
      partners: {
        title: 'volunteering.engagementDetail.providedBy',
        details: [
          {
            image: 'voltastics-logo.png',
            onPress: expect.any(Function),
            title: 'Voltastics',
          },
        ],
      },
      status: null,
    })
  })

  it('should open correct link for organizer', () => {
    const { t } = useTranslation()
    const onOpenLink = jest.fn()
    const result = transformTypesenseDocument({ t, language: 'en', document: baseDocument, onOpenLink, status: null })

    result.author?.onPress?.()

    expect(onOpenLink).toHaveBeenCalledWith('https://example.com/organizer')
  })

  it('should open correct link for partner', () => {
    const { t } = useTranslation()
    const onOpenLink = jest.fn()
    const result = transformTypesenseDocument({ t, language: 'en', document: baseDocument, onOpenLink, status: null })

    result.partners?.details[0]?.onPress?.()

    expect(onOpenLink).toHaveBeenCalledWith('https://example.com/volunteering')
  })

  it('should handle German language preference correctly', () => {
    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'de',
      document: baseDocument,
      onOpenLink: jest.fn(),
      status: null,
    })

    expect(result.title).toBe('Deutscher Titel')
    expect(Array.isArray(result.bodyContent) ? result.bodyContent[0].content : result.bodyContent?.content).toBe(
      'Deutsche Beschreibung'
    )
  })

  it('should fall back to English when German is not available', () => {
    const docWithoutGerman: TypesenseDocument = {
      ...baseDocument,
      title_de: undefined,
      description_de: undefined,
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: docWithoutGerman,
      onOpenLink: jest.fn(),
      status: null,
    })

    expect(result.title).toBe('English Title')
    expect(Array.isArray(result.bodyContent) ? result.bodyContent[0].content : result.bodyContent?.content).toBe(
      'English Description'
    )
  })

  it('should handle missing optional fields gracefully', () => {
    const minimalDocument: TypesenseDocument = {
      type: TypesenseDocumentType.Volunteering,
      id: 'minimal-id',
      source: 'GoVolunteer',
    }
    const onOpenLink = jest.fn()

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: minimalDocument,
      onOpenLink,
      status: null,
    })

    expect(result).toEqual({
      title: '',
      bodyContent: { content: '' },
      chips: [],
      visibility: 'public',
      infoList: [],
      coverImage: undefined,
      author: {
        topTitle: 'postedVia',
        title: 'GoVolunteer',
        mainAvatar: {
          label: '??',
        },
        isExternalLink: false,
      },
      externalUrl: undefined,
      source: 'GoVolunteer',
      partners: {
        title: 'volunteering.engagementDetail.providedBy',
        details: [
          {
            image: 'govolunteer-logo.svg',
            title: 'GoVolunteer',
          },
        ],
      },
      status: null,
    })
  })

  it('should handle image URLs correctly', () => {
    const documentWithImages: TypesenseDocument = {
      ...baseDocument,
      image_url: 'https://example.com/image.jpg',
      organizer_image_url: 'https://example.com/org-logo.jpg',
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: documentWithImages,
      onOpenLink: jest.fn(),
      status: null,
    })

    expect(result.coverImage).toEqual({
      uri: 'https://example.com/image.jpg',
    })
    expect(result.author?.mainAvatar?.source).toBe('https://example.com/org-logo.jpg')
  })

  it('should handle unknown source gracefully', () => {
    const docWithUnknownSource: TypesenseDocument = {
      ...baseDocument,
      source: 'UnknownSource',
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: docWithUnknownSource,
      onOpenLink: jest.fn(),
      status: null,
    })
    expect(result.author?.title).toBe('Test Organization')
    // Should not crash when partner is undefined
    expect(result.partners).toEqual({
      title: 'volunteering.engagementDetail.providedBy',
      details: [
        {
          title: 'UnknownSource',
          onPress: expect.any(Function),
        },
      ],
    })
  })

  it('should handle missing organizer name gracefully', () => {
    const docWithoutOrgName: TypesenseDocument = {
      ...baseDocument,
      organizer_name: undefined,
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: docWithoutOrgName,
      onOpenLink: jest.fn(),
      status: null,
    })
    expect(result.author?.title).toBe('Voltastics')
    expect(result.author?.mainAvatar?.label).toBe('??')
  })

  it('should handle remote opportunity', () => {
    const remoteDocument: TypesenseDocument = {
      ...baseDocument,
      location_type: 'remote',
      location: '', // No location for truly remote
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: remoteDocument,
      onOpenLink: jest.fn(),
      status: null,
    })
    expect(result.infoList).toEqual([
      {
        title: 'task.locationType.REMOTE',
        icon: Global,
      },
      {
        title: 'volunteering.engagement.commitment_label.recurring',
        icon: Refresh,
      },
      {
        icon: AiEstimatedTime,
        subtitle: 'volunteeringDetails.timeAI',
        subtitleColor: 'informative',
        title: 'volunteering.engagement.commitment_duration.HOURS_1to2',
      },
      {
        icon: Globe,
        title: 'www.lovelace.com',
        onPress: expect.any(Function),
        showExternalIcon: true,
      },
    ])
  })

  it('should handle hybrid opportunity (remote with location)', () => {
    const hybridDocument: TypesenseDocument = {
      ...baseDocument,
      location_type: 'remote',
      location: 'Berlin, Germany', // Has location, so it's hybrid
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: hybridDocument,
      onOpenLink: jest.fn(),
      status: null,
    })
    expect(result.infoList).toEqual([
      {
        title: 'task.locationType.HYBRID',
        icon: Global,
        subtitle: 'Berlin, Germany',
      },
      {
        title: 'volunteering.engagement.commitment_label.recurring',
        icon: Refresh,
      },
      {
        icon: AiEstimatedTime,
        subtitle: 'volunteeringDetails.timeAI',
        subtitleColor: 'informative',
        title: 'volunteering.engagement.commitment_duration.HOURS_1to2',
      },
      {
        icon: Globe,
        title: 'www.lovelace.com',
        onPress: expect.any(Function),
        showExternalIcon: true,
      },
    ])
  })

  it('should ignore indeterminate duration', () => {
    const docWithIntermediateDuration: TypesenseDocument = {
      ...baseDocument,
      commitment_duration: 'INDETERMINATE',
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: docWithIntermediateDuration,
      onOpenLink: jest.fn(),
      status: null,
    })
    expect(result.infoList).toEqual([
      {
        title: 'Berlin, Germany',
        icon: MapPin2,
      },
      {
        title: 'volunteering.engagement.commitment_label.recurring',
        icon: Refresh,
      },
      {
        icon: Globe,
        title: 'www.lovelace.com',
        onPress: expect.any(Function),
        showExternalIcon: true,
      },
    ])
  })

  it('should add missing protocol to external urls', () => {
    const docWithIntermediateDuration: TypesenseDocument = {
      ...baseDocument,
      organizer_url: 'www.ada.org',
      external_url: 'www.lovelace.com',
    }
    const onOpenLink = jest.fn()

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: docWithIntermediateDuration,
      onOpenLink,
      status: null,
    })
    expect(result.infoList).toEqual([
      {
        title: 'Berlin, Germany',
        icon: MapPin2,
      },
      {
        title: 'volunteering.engagement.commitment_label.recurring',
        icon: Refresh,
      },
      {
        icon: AiEstimatedTime,
        subtitle: 'volunteeringDetails.timeAI',
        subtitleColor: 'informative',
        title: 'volunteering.engagement.commitment_duration.HOURS_1to2',
      },
      {
        icon: Globe,
        title: 'www.lovelace.com',
        onPress: expect.any(Function),
        showExternalIcon: true,
      },
    ])
    expect(result.author).toEqual({
      topTitle: 'postedVia',
      title: 'Test Organization',
      mainAvatar: {
        label: 'Test Organization',
        source: 'https://example.com/organizer/image.jpg',
      },
      isExternalLink: true,
      onPress: expect.any(Function),
    })

    // Simulate link press on external link
    result?.infoList?.at(3)?.onPress?.()

    expect(onOpenLink).toHaveBeenCalledWith('https://www.lovelace.com/')

    // Simulate link press on website link
    result?.author?.onPress?.()

    expect(onOpenLink).toHaveBeenCalledWith('https://www.ada.org/')
  })

  it('should ignore invalid external urls', () => {
    const docWithIntermediateDuration: TypesenseDocument = {
      ...baseDocument,
      organizer_url: 'invalid url',
      external_url: 'invalid url',
      contact: [],
    }
    const onOpenLink = jest.fn()

    const { t } = useTranslation()
    const result = transformTypesenseDocument({
      t,
      language: 'en',
      document: docWithIntermediateDuration,
      onOpenLink,
      status: null,
    })
    expect(result.infoList).toEqual([
      {
        title: 'Berlin, Germany',
        icon: MapPin2,
      },
      {
        title: 'volunteering.engagement.commitment_label.recurring',
        icon: Refresh,
      },
      {
        icon: AiEstimatedTime,
        subtitle: 'volunteeringDetails.timeAI',
        subtitleColor: 'informative',
        title: 'volunteering.engagement.commitment_duration.HOURS_1to2',
      },
    ])
    expect(result.author).toEqual({
      topTitle: 'postedVia',
      title: 'Test Organization',
      mainAvatar: {
        label: 'Test Organization',
        source: 'https://example.com/organizer/image.jpg',
      },
      isExternalLink: false,
    })
  })
})
