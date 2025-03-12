import React from 'react'
import { UserTermsRow } from '@holi/core/screens/userprofile/components/UserTermsRow'
import { render, screen, userEvent } from '@testing-library/react-native'
import { type LoggedInState, useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

const mockUseLoggedInUser = jest.mocked(useLoggedInUser)
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

describe('UserTermsRow', () => {
  beforeEach(() => {
    const mockedUser: LoggedInState = {
      state: 'loggedIn',
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
      user: {
        isEmployee: false,
        id: '',
        identity: '',
        avatarDefaultColor: '',
        avatarLabel: '',
        fullName: '',
        interestsV2: ['gender-equality', 'disaster-relief'],
        skillsV2: ['legal-assistance', 'other', 'driving'],
      },
    }
    mockUseLoggedInUser.mockReturnValue(mockedUser)
  })

  it('should list user interests and matching texts', () => {
    render(<UserTermsRow termType="topic" />)

    expect(screen.getByText('topic.disaster-relief'))
    expect(screen.getByText('topic.gender-equality'))
    expect(screen.getByText('profile.interests'))
  })

  it('should list user skills and matching texts', () => {
    render(<UserTermsRow termType="skill" />)

    expect(screen.getByText('skill.driving'))
    expect(screen.getByText('skill.legal-assistance'))
    expect(screen.getByText('skill.other'))
    expect(screen.getByText('profile.skills'))
  })

  it('should call onPressEdit callback when pressing the edit button', async () => {
    const onPressEdit = jest.fn()
    const user = userEvent.setup()
    render(<UserTermsRow termType="topic" onPressEdit={onPressEdit} />)

    await user.press(screen.getByText('global.edit'))

    expect(onPressEdit).toHaveBeenCalled()
  })

  it('should call onPressEdit callback when pressing the add button', async () => {
    mockUseLoggedInUser.mockReturnValue({ user: {} } as LoggedInState)
    const onPressEdit = jest.fn()
    const user = userEvent.setup()
    render(<UserTermsRow termType="topic" onPressEdit={onPressEdit} />)

    await user.press(screen.getByLabelText('profile.interests.add'))

    expect(onPressEdit).toHaveBeenCalled()
  })
})
