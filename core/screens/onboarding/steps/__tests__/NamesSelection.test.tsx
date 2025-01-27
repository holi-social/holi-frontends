import { MockedProvider } from '@apollo/client/testing'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import type { User } from '@holi/core/domain/shared/types'
import { useNamesSelection } from '@holi/core/screens/onboarding/hooks/useNamesSelection'
import { NamesSelection } from '@holi/core/screens/onboarding/steps/NamesSelection'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'
import { updateAuthenticatedUserV2Mutation } from '@holi/core/screens/userprofile/queries'
import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

const mockUseLoggedInUser = useLoggedInUser as jest.Mock
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

const mockUseNamesSelection = useNamesSelection as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/useNamesSelection', () => ({
  useNamesSelection: jest.fn(),
}))

const labels = {
  firstName: 'onboarding.names.firstName.input.label',
  lastName: 'onboarding.names.lastName.input.label',
  pronouns: 'user.profileForm.pronouns',
}
const nameFields: (keyof typeof labels)[] = ['firstName', 'lastName']

describe('NamesSelection', () => {
  const loggedInUser = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    pronouns: 'she/her',
  } as User
  const userWithoutNames = {
    firstName: '',
    lastName: '',
    pronouns: '',
  } as User
  const userData: OnboardingUserData = {
    content: 'SPACES',
    location: {
      id: '1',
      label: 'Hamburg, Germany',
      geolocation: {
        place_id: '1',
        properties: { formatted: 'Hamburg, Germany' },
        geometry: { type: 'MultiPolygon', coordinates: [] },
      },
    },
    interests: ['topic-1'],
    skills: ['skill-1', 'skill-2'],
  }

  const updateMock = {
    request: {
      query: updateAuthenticatedUserV2Mutation,
      variables: {
        input: {
          ...loggedInUser,
          interests: userData.interests,
          skills: userData.skills,
          location: userData.location?.label,
          geolocation: userData.location?.geolocation,
        },
      },
    },
    result: {
      data: {
        updateAuthenticatedUserV2: loggedInUser,
      },
    },
  }
  const failingUpdateMock = {
    request: {
      query: updateAuthenticatedUserV2Mutation,
      variables: {
        input: {
          ...loggedInUser,
          interests: userData.interests,
          skills: userData.skills,
          location: userData.location?.label,
          geolocation: userData.location?.geolocation,
        },
      },
    },
    error: Error('Test'),
  }

  beforeEach(() => {
    mockUseLoggedInUser.mockReturnValue({ user: loggedInUser })
    mockUseNamesSelection.mockReturnValue({ names: loggedInUser })
  })

  it('should render texts and input fields', () => {
    render(
      <MockedProvider>
        <NamesSelection userData={userData} onFinish={jest.fn()} />
      </MockedProvider>
    )

    expect(screen.getByText('onboarding.names.headline')).toBeOnTheScreen()
    expect(screen.getByText('onboarding.names.subline')).toBeOnTheScreen()

    expect(screen.getByLabelText(labels['firstName'])).toBeOnTheScreen()
    expect(screen.getByLabelText(labels['lastName'])).toBeOnTheScreen()
    expect(screen.getByLabelText(labels['pronouns'])).toBeOnTheScreen()
  })

  it('should render loader while user is loading', () => {
    mockUseLoggedInUser.mockReturnValue({ isLoading: true, user: loggedInUser })

    render(
      <MockedProvider>
        <NamesSelection userData={userData} onFinish={jest.fn()} />
      </MockedProvider>
    )

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('should use initial user names in input fields', () => {
    render(
      <MockedProvider>
        <NamesSelection userData={userData} onFinish={jest.fn()} />
      </MockedProvider>
    )

    expect(mockUseNamesSelection).toHaveBeenCalledWith({ user: loggedInUser })
    expect(screen.getByLabelText(labels['firstName'])).toHaveProp('value', 'Ada')
    expect(screen.getByLabelText(labels['lastName'])).toHaveProp('value', 'Lovelace')
    expect(screen.getByLabelText(labels['pronouns'])).toHaveProp('value', 'she/her')
  })

  it('should enable submit button if input is valid', () => {
    mockUseNamesSelection.mockReturnValue({ names: loggedInUser, nameStepIsValid: true })

    render(
      <MockedProvider>
        <NamesSelection userData={userData} onFinish={jest.fn()} />
      </MockedProvider>
    )

    expect(screen.getByRole('button')).toBeEnabled()
  })

  it('should disable submit button if input is not valid', () => {
    render(
      <MockedProvider>
        <NamesSelection userData={userData} onFinish={jest.fn()} />
      </MockedProvider>
    )

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it.each(Object.entries(labels))('should update %s on input', async (field, label) => {
    const onNamesChange = jest.fn()
    mockUseNamesSelection.mockReturnValue({ names: userWithoutNames, onNamesChange })
    const user = userEvent.setup()

    render(
      <MockedProvider>
        <NamesSelection userData={userData} onFinish={jest.fn()} />
      </MockedProvider>
    )

    await user.paste(screen.getByLabelText(label), 'Update')

    expect(onNamesChange).toHaveBeenCalledWith(field, 'Update')
  })

  it.each(nameFields)('should replace special chars in %s before update', async (field) => {
    const onNamesChange = jest.fn()
    mockUseNamesSelection.mockReturnValue({ names: userWithoutNames, onNamesChange })
    const user = userEvent.setup()

    render(
      <MockedProvider>
        <NamesSelection userData={userData} onFinish={jest.fn()} />
      </MockedProvider>
    )

    await user.paste(screen.getByLabelText(labels[field]), '%&Ad?a+*')

    expect(onNamesChange).toHaveBeenCalledWith(field, 'Ada')
  })

  it('should update user with onboarding data and call onFinish on submit', async () => {
    const onFinish = jest.fn()
    const user = userEvent.setup()
    mockUseNamesSelection.mockReturnValue({ names: loggedInUser, nameStepIsValid: true })

    render(
      <MockedProvider mocks={[updateMock]}>
        <NamesSelection userData={userData} onFinish={onFinish} />
      </MockedProvider>
    )

    await user.press(screen.getByRole('button'))

    expect(onFinish).toHaveBeenCalled()
  })

  it.each(nameFields)('should display field errors for %s', (field) => {
    mockUseNamesSelection.mockReturnValue({ names: userWithoutNames, namesFieldErrors: { [field]: ['Too short'] } })

    render(
      <MockedProvider>
        <NamesSelection userData={userData} onFinish={jest.fn()} />
      </MockedProvider>
    )

    expect(screen.getByText('Too short')).toBeOnTheScreen()
  })

  it('should handle backend errors', async () => {
    const user = userEvent.setup()
    const onFinish = jest.fn()
    const handleBackendError = jest.fn()
    mockUseNamesSelection.mockReturnValue({ names: loggedInUser, nameStepIsValid: true, handleBackendError })

    render(
      <MockedProvider mocks={[failingUpdateMock]}>
        <NamesSelection userData={userData} onFinish={onFinish} />
      </MockedProvider>
    )

    await user.press(screen.getByRole('button'))

    expect(handleBackendError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Test' }))
    expect(onFinish).not.toHaveBeenCalled()
  })
})
