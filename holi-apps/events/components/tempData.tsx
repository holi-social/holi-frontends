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
        location: {
          street: 'Innovation Avenue',
          streetNo: '42',
          zipCode: '10115',
          city: 'Berlin',
        },
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
