import { LocationType, Regularity, SpaceConnectionType, VisibilityType } from '@holi/core/screens/spaces/types'

export const tempData = {
  events: {
    totalResults: 2,
    data: [
      {
        id: 'ev-001',
        title: 'Tech Conference 2025',
        organisationName: 'TechCorp International',
        startDate: '2025-04-15T09:00:00Z',
        endDate: '2025-04-17T18:00:00Z',
        location: {
          street: 'Innovation Avenue',
          streetNo: '42',
          zipCode: '10115',
          city: 'Berlin',
        },
        isRemote: false,
        imageUrl: 'https://example.com/images/tech-conference-2025.jpg',
        eventDetails: {
          description:
            'Join us for the leading technology conference focusing on AI, blockchain, and cloud computing innovations.',
          externalLink: 'https://example.com/tech-conference-2025',
          meetingLink: 'https://meeting.example.com/tech-conference-2025',
        },
      },
      {
        id: 'ev-002',
        title: 'Virtual Design Workshop',
        organisationName: 'Creative Design Alliance',
        startDate: '2025-05-10T14:00:00Z',
        endDate: '2025-05-10T17:30:00Z',
        location: null,
        isRemote: true,
        imageUrl: 'https://example.com/images/design-workshop.jpg',
        eventDetails: {
          description:
            'A hands-on virtual workshop exploring the latest UX/UI design principles and tools for modern applications.',
          externalLink: 'https://example.com/design-workshop',
          meetingLink: 'https://meeting.example.com/design-workshop',
        },
      },
    ],
  },
}

export const testSpace = {
  id: 'space-123',
  title: 'Community Hub',
  description: 'A local community space.',
  created: '2024-03-04T12:00:00Z',
  connectionStatusToMyself: [SpaceConnectionType.MEMBER],
  members: {
    totalResults: 1,
    data: [
      {
        data: {},
        id: 'member-1',
        user: {
          id: 'user-1',
          identity: 'john_doe',
          fullName: 'John Doe',
          avatarDefaultColor: '#ff5733',
          avatarLabel: 'JD',
        },
        created: '2024-03-01T10:00:00Z',
      },
    ],
  },
  membershipRequests: {
    totalResults: 0,
    data: [],
  },
  appointments: {
    totalResults: 0,
    data: [],
  },
  avatarDefaultColor: '#ff5733',
  name: 'Community Hub',
}

export const testTask = {
  id: 'testid',
  name: 'testname',
  description: 'testdescription',
  creator: { id: 'testcreator' },
  slotsAvailable: 2,
  slotsTaken: 3,
  location: 'testlocation',
  locationType: LocationType.REMOTE,
  regularity: Regularity.ONE_TIME,
  skills: [
    {
      id: 'skillid',
      title: 'skilltitle',
      slug: 'skillslug',
    },
  ],
  visibility: VisibilityType.MEMBERS,
  contactEmail: 'contactEmail',
  space: testSpace,
}
