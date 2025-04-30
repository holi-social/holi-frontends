import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'
import type { TypesenseDocument } from '@holi/core/typesense/types'

interface TestData {
  document: Pick<TypesenseDocument, 'type' | 'link_locators'>
  expectedLink: string
}

describe('linkFromLocator', () => {
  const testData: TestData[] = [
    {
      document: {
        type: 'space',
        link_locators: { space: 'coworking-mitte' },
      },
      expectedLink: '/spaces/coworking-mitte',
    },
    {
      document: {
        type: 'space',
        link_locators: {},
      },
      expectedLink: '#',
    },
    {
      document: {
        type: 'profile',
        link_locators: { profile: '9035322c-3d67-46ca-a2b8-657be490ec00' },
      },
      expectedLink: '/profile/9035322c-3d67-46ca-a2b8-657be490ec00',
    },
    {
      document: {
        type: 'profile',
        link_locators: {},
      },
      expectedLink: '#',
    },
    {
      document: {
        type: 'volunteering',
        link_locators: { volunteering: 157403 },
      },
      expectedLink: '/volunteering/157403',
    },
    {
      document: {
        type: 'volunteering',
        link_locators: {},
      },
      expectedLink: '#',
    },
    {
      document: {
        type: 'task',
        link_locators: { space: 'coworking-mitte', task: '9035322c-3d67-46ca-a2b8-657be490ec00' },
      },
      expectedLink: '/spaces/coworking-mitte/tasks/9035322c-3d67-46ca-a2b8-657be490ec00',
    },
    {
      document: {
        type: 'task',
        link_locators: { task: '9035322c-3d67-46ca-a2b8-657be490ec00' },
      },
      expectedLink: '#',
    },
    {
      document: {
        type: 'task',
        link_locators: { space: 'coworking-mitte' },
      },
      expectedLink: '#',
    },
    {
      document: {
        type: 'task',
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
