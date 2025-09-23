import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'
import { TypesenseDocumentType, type TypesenseDocument } from '@holi/core/typesense/types'

interface TestData {
  document: Pick<TypesenseDocument, 'type' | 'link_locators'>
  expectedLink: string
}

describe('linkFromLocator', () => {
  const testData: TestData[] = [
    {
      document: {
        type: TypesenseDocumentType.Space,
        link_locators: { space: 'coworking-mitte' },
      },
      expectedLink: '/spaces/coworking-mitte',
    },
    {
      document: {
        type: TypesenseDocumentType.Space,
        link_locators: {},
      },
      expectedLink: '#',
    },
    {
      document: {
        type: TypesenseDocumentType.Profile,
        link_locators: { profile: '9035322c-3d67-46ca-a2b8-657be490ec00' },
      },
      expectedLink: '/profile/9035322c-3d67-46ca-a2b8-657be490ec00',
    },
    {
      document: {
        type: TypesenseDocumentType.Profile,
        link_locators: {},
      },
      expectedLink: '#',
    },
    {
      document: {
        type: TypesenseDocumentType.Volunteering,
        link_locators: { volunteering: '157403' },
      },
      expectedLink: '/volunteering/157403',
    },
    {
      document: {
        type: TypesenseDocumentType.Volunteering,
        link_locators: {},
      },
      expectedLink: '#',
    },
    {
      document: {
        type: TypesenseDocumentType.Donation,
        link_locators: { donation: '157403' },
      },
      expectedLink: '/donations/157403',
    },
    {
      document: {
        type: TypesenseDocumentType.Donation,
        link_locators: {},
      },
      expectedLink: '#',
    },
    {
      document: {
        type: TypesenseDocumentType.Task,
        link_locators: { space: 'coworking-mitte', task: '9035322c-3d67-46ca-a2b8-657be490ec00' },
      },
      expectedLink: '/spaces/coworking-mitte/tasks/9035322c-3d67-46ca-a2b8-657be490ec00',
    },
    {
      document: {
        type: TypesenseDocumentType.Task,
        link_locators: { task: '9035322c-3d67-46ca-a2b8-657be490ec00' },
      },
      expectedLink: '#',
    },
    {
      document: {
        type: TypesenseDocumentType.Task,
        link_locators: { space: 'coworking-mitte' },
      },
      expectedLink: '#',
    },
    {
      document: {
        type: TypesenseDocumentType.Task,
        link_locators: {},
      },
      expectedLink: '#',
    },
  ]
  it.each(testData)('should create correct link for document of type $document.type', ({ document, expectedLink }) => {
    const link = linkFromLocator(document.type, document.link_locators)

    expect(link).toEqual(expectedLink)
  })
})
