import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'

const authenticatedUserMock = {
  request: {
    query: authenticatedUserV2Query,
  },
  result: {
    data: {
      authenticatedUserV2: {
        id: 'user-123',
        identity: 'test@example.com',
        avatar: null,
        avatarBlurhash: null,
        avatarDefaultColor: '#FF0000',
        avatarLabel: 'T',
        fullName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        aboutMe: null,
        pronouns: null,
        location: null,
        role: 'USER',
        geolocationId: null,
        engagementLevel: 'ACTIVE',
        interestsV2: [],
        skillsV2: [],
        connectionStatusToMyself: 'MYSELF',
        trackingConsentAnalytics: true,
        trackingConsentPersonalization: true,
        trackingConsentAdPartners: false,
        isEmployee: false,
        email: 'test@example.com',
        isOidc: false,
        accountType: 'REGULAR',
        __typename: 'AuthenticatedUser',
      },
    },
  },
}

describe('SpaceTaskList', () => {
  it('renders correctly when there are tasks within space', () => {
    render(
      <MockedProvider mocks={[authenticatedUserMock]}>
        <SpaceTaskList space={space} isCollaborator={false} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when there are no tasks within space', () => {
    const spaceWithoutTasks = {
      ...space,
      tasks: [],
    }
    render(
      <MockedProvider mocks={[authenticatedUserMock]}>
        <SpaceTaskList space={spaceWithoutTasks} isCollaborator={false} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toHaveTextContent(/spaces.spaceDetails.tasks.empty.title.forNonMembers/)
    expect(screen.toJSON()).toHaveTextContent(/spaces.spaceDetails.tasks.empty.message.forNonMembers/)
  })
})
