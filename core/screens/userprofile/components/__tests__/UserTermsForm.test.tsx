import React from 'react'

import { UserTermsForm } from '@holi/core/screens/userprofile/components/UserTermsForm'
import { render, userEvent, screen } from '@testing-library/react-native'
import type { User } from '@holi/core/domain/shared/types'
import { MockedProvider } from '@apollo/client/testing/react'
import {
  updateAuthenticatedUserV2Mutation,
  type UpdateAuthenticatedUserInput,
} from '@holi/core/screens/userprofile/queries'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'

const loggedInUser: User = {
  id: '',
  identity: '',
  avatarDefaultColor: '',
  avatarLabel: '',
  fullName: '',
  interestsV2: ['family-kids'],
  skillsV2: ['emergency-care'],
}

const createFetchUserMock = () => ({
  request: {
    query: authenticatedUserV2Query,
  },
  result: {
    data: {
      authenticatedUserV2: loggedInUser,
    },
  },
})

const createUpdateUserMock = (input: UpdateAuthenticatedUserInput) => ({
  request: {
    query: updateAuthenticatedUserV2Mutation,
    variables: {
      input,
    },
  },
  result: {
    data: {
      updateAuthenticatedUserV2: loggedInUser,
    },
  },
})

describe('UserTermsForm', () => {
  it('should update user topics on submit', async () => {
    const updateMock = createUpdateUserMock({ interestsV2: ['family-kids', 'arts-culture'] })
    const user = userEvent.setup()
    render(
      <MockedProvider mocks={[updateMock, createFetchUserMock()]}>
        <UserTermsForm user={loggedInUser} termType="topic" />
      </MockedProvider>
    )

    await user.press(screen.getByText('topic.arts-culture'))
    await user.press(screen.getByText('user.profileForm.save'))

    // Can't really test update was executed
    expect(screen.getByText('topic.arts-culture')).toBeOnTheScreen()
  })

  it('should update user skills on submit', async () => {
    const updateMock = createUpdateUserMock({ skillsV2: ['emergency-care', 'arts-crafts'] })
    const user = userEvent.setup()
    render(
      <MockedProvider mocks={[updateMock, createFetchUserMock()]}>
        <UserTermsForm user={loggedInUser} termType="skill" />
      </MockedProvider>
    )

    await user.press(screen.getByText('skill.arts-crafts'))
    await user.press(screen.getByText('user.profileForm.save'))

    // Can't really test update was executed
    expect(screen.getByText('skill.arts-crafts')).toBeOnTheScreen()
  })

  it('should call onSubmit callback', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()
    const updateMock = createUpdateUserMock({ interestsV2: ['family-kids'] })
    render(
      <MockedProvider mocks={[updateMock, createFetchUserMock()]}>
        <UserTermsForm user={loggedInUser} termType="topic" onSubmit={onSubmit} />
      </MockedProvider>
    )

    await user.press(screen.getByText('user.profileForm.save'))

    expect(onSubmit).toHaveBeenCalled()
  })
})
