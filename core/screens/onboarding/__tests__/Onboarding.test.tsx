import { MockedProvider } from '@apollo/client/testing'
import {
  getOrCreateVerificationFlow,
  getVerificationFlowFromRegistration,
  hasIdentifier,
  initRegistrationFlow,
  submitVerificationFlow,
} from '@holi/core/auth/helpers/auth'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import { skillsQuery, topicsQuery } from '@holi/core/domain/shared/queries'
import { geoPlacesQuery } from '@holi/core/geolocation/queries'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import {
  clearOnboardingUserDataAsyncStore,
  getOnboardingUserDataAsyncStore,
  storeOnboardingUserDataAsyncStore,
} from '@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore'
import { testLocation } from '@holi/core/screens/onboarding/hooks/__tests__/useUserData.test'
import { storeOnboardingState, useOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { showOnboardingFinishModal } from '@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { skills, topics } from '@holi/core/screens/spaces/__tests__/testData'
import { interestsQuery, updateAuthenticatedUserV2Mutation } from '@holi/core/screens/userprofile/queries'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { act } from '@testing-library/react-hooks'
import { render, screen, userEvent } from '@testing-library/react-native'
import { Button } from 'holi-bricks/components/button'
import React from 'react'

const mockUseRedirect = useRedirect as jest.Mock
jest.mock('@holi/core/navigation/hooks/useRedirect', () => ({
  useRedirect: jest.fn(),
}))

const mockUseTracking = useTracking as jest.Mock
jest.mock('@holi/core/tracking/hooks/useTracking', () => jest.fn())

const mockUseLoginState = useLoginState as jest.Mock
const mockSetLoginStateLoggedIn = setLoginStateLoggedIn as jest.Mock
jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
  setLoginStateLoggedIn: jest.fn(),
}))

const mockUseLoggedInUser = useLoggedInUser as jest.Mock
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

const mockUsePreventBackNavigation = usePreventBackNavigation as jest.Mock
jest.mock('@holi/core/navigation/hooks/usePreventBackNavigation', () => jest.fn())

const mockUseOnboardingState = useOnboardingState as jest.Mock
const mockStoreOnboardingState = storeOnboardingState as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  useOnboardingState: jest.fn(),
  storeOnboardingState: jest.fn(),
}))

const mockGetOnboardingUserDataAsyncStore = getOnboardingUserDataAsyncStore as jest.Mock
const mockClearOnboardingUserDataAsyncStore = clearOnboardingUserDataAsyncStore as jest.Mock
const mockStoreOnboardingUserDataAsyncStore = storeOnboardingUserDataAsyncStore as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore', () => {
  return {
    getOnboardingUserDataAsyncStore: jest.fn(),
    clearOnboardingUserDataAsyncStore: jest.fn(),
    storeOnboardingUserDataAsyncStore: jest.fn(),
  }
})

const mockShowOnboardingFinishModal = showOnboardingFinishModal as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState', () => ({
  showOnboardingFinishModal: jest.fn(),
}))

const mockInitRegistrationFlow = initRegistrationFlow as jest.Mock
const mockGetVerificationFlowFromRegistration = getVerificationFlowFromRegistration as jest.Mock
const mockGetOrCreateVerificationFlow = getOrCreateVerificationFlow as jest.Mock
const mockSubmitVerificationFlow = submitVerificationFlow as jest.Mock
const mockHasIdentifier = hasIdentifier as unknown as jest.Mock
jest.mock('@holi/core/auth/helpers/auth', () => ({
  initRegistrationFlow: jest.fn(),
  getVerificationFlowFromRegistration: jest.fn(),
  getOrCreateVerificationFlow: jest.fn(),
  submitVerificationFlow: jest.fn(),
  hasIdentifier: jest.fn(),
}))

const mockNewKratosSdk = newKratosSdk as jest.Mock
jest.mock('@holi/core/auth/helpers/sdk', () => ({
  newKratosSdk: jest.fn(),
}))

export const RegistrationFormMock = ({ onSubmit }: { onSubmit: (payload: object) => Promise<void> }) => {
  return (
    <Button
      onPress={() => onSubmit({ method: 'password', password: 'p455w0rd' })}
      label={'registration-submit-button'}
    />
  )
}
jest.mock('@holi/core/auth/components/FormBuilder', () => RegistrationFormMock)

jest.useFakeTimers()

interface Event {
  action: 'press' | 'type' | 'paste'
  label: string
  input?: string
  queryByText?: boolean
}

const mocks = [
  {
    request: {
      query: topicsQuery,
    },
    result: {
      data: {
        topics: { data: topics },
      },
    },
  },
  {
    request: {
      query: interestsQuery,
    },
    result: {
      data: {
        interests: { data: topics },
      },
    },
  },
  {
    request: {
      query: skillsQuery,
    },
    result: {
      data: {
        skills: { data: skills },
      },
    },
  },
  {
    request: {
      query: updateAuthenticatedUserV2Mutation,
      variables: {
        input: {
          firstName: 'Ada',
          lastName: '',
          pronouns: '',
          interests: [],
          skills: [],
        },
      },
    },
    result: {
      data: {
        updateAuthenticatedUserV2: {},
      },
    },
  },
  {
    request: {
      query: updateAuthenticatedUserV2Mutation,
      variables: {
        input: {
          firstName: 'Ada',
          lastName: 'Lovelace',
          pronouns: 'she/her',
          interests: ['ANIMAL_WELFARE'],
          skills: ['CREATIVITY'],
          location: testLocation.label,
          geolocation: testLocation.geolocation,
        },
      },
    },
    result: {
      data: {
        updateAuthenticatedUserV2: {},
      },
    },
  },
  {
    request: {
      query: geoPlacesQuery,
      variables: {
        text: 'Hamburg, Germany',
        limit: 3,
        level: 'city',
      },
    },
    result: {
      data: {
        geo_placesAutocomplete: [
          {
            id: '1',
            name: 'Hamburg, Germany',
            city: 'Hamburg',
            state: 'Hamburg',
            country: 'Germany',
            coordinates: { latitude: 1, longitude: 2 },
          },
        ],
      },
    },
  },
]

describe('Onboarding', () => {
  const redirect = jest.fn()
  const track = jest.fn()
  const defaultUserData = {
    interests: [],
    skills: [],
  }

  const navigateThroughOnboarding = async (events: Event[] = []) => {
    const user = userEvent.setup()

    render(
      <MockedProvider mocks={mocks}>
        <Onboarding />
      </MockedProvider>
    )

    for (const event of events) {
      const element = event.queryByText ? screen.getByText(event.label) : screen.getByLabelText(event.label)
      await user[event.action](element, event.input ?? '')

      await act(async () => {
        await jest.runOnlyPendingTimersAsync()
      })
    }
  }

  const expectOnboardingCleanUp = () => {
    expect(mockStoreOnboardingState).toHaveBeenCalledWith('finished')
    expect(mockClearOnboardingUserDataAsyncStore).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith(true)
  }

  beforeEach(() => {
    mockUseOnboardingState.mockReturnValue('onboarding')
    mockUseTracking.mockReturnValue({ track })
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: false })
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue(undefined)
    mockStoreOnboardingUserDataAsyncStore.mockResolvedValue(undefined)
    mockUseRedirect.mockReturnValue(redirect)

    // Mocks for registration
    mockInitRegistrationFlow.mockResolvedValue({ data: { id: 'test' } })
    mockGetVerificationFlowFromRegistration.mockReturnValue({ id: 'test' })
    const updateRegistrationFlow = jest
      .fn()
      .mockResolvedValue({ data: { session: { id: 'test' }, session_token: 'some_token' } })
    mockNewKratosSdk.mockReturnValue({ updateRegistrationFlow })
    mockUseLoginState.mockReturnValue({ isLoggedOut: true })
    mockSetLoginStateLoggedIn.mockResolvedValue({})

    // Mocks for e-mail verification
    mockGetOrCreateVerificationFlow.mockResolvedValue({ id: 'test', state: 'sent_email' })
    mockSubmitVerificationFlow.mockResolvedValue({
      state: 'passed_challenge',
      ui: { messages: [] },
    })
    mockHasIdentifier.mockReturnValue(false)
  })

  it('should display loader until step is determined', async () => {
    mockUseOnboardingState.mockReturnValue(null)

    render(
      <MockedProvider mocks={mocks}>
        <Onboarding />
      </MockedProvider>
    )

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('should prevent back navigation', () => {
    render(
      <MockedProvider mocks={mocks}>
        <Onboarding />
      </MockedProvider>
    )

    expect(mockUsePreventBackNavigation).toHaveBeenCalled()
  })

  it('should leave and clean up onboarding if logged in user already finished onboarding', async () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true })
    mockUseOnboardingState.mockReturnValue('finished')

    render(
      <MockedProvider mocks={mocks}>
        <Onboarding />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expectOnboardingCleanUp()
  })

  it('should redirect to selected content type', async () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true })
    mockUseOnboardingState.mockReturnValue('finished')
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue({
      ...defaultUserData,
      content: 'SPACES',
    })

    render(
      <MockedProvider mocks={mocks}>
        <Onboarding />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(mockUseRedirect).toHaveBeenCalledWith('/spaces?tab=discover')
  })

  it('should complete the whole flow', async () => {
    // Prefill location as dropdown is not working properly in unit tests
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue({
      ...defaultUserData,
      location: testLocation,
    })

    await navigateThroughOnboarding([
      // Welcome
      { action: 'press', label: 'onboarding.welcome.forward' },
      // Content selection
      { action: 'press', label: 'onboarding.contentSelection.SPACES' },
      { action: 'press', label: 'global.next' },
      // Location is prefilled
      { action: 'press', label: 'onboarding.welcome.forward' },
      // Interests
      { action: 'press', label: 'Animal Welfare', queryByText: true },
      { action: 'press', label: 'onboarding.welcome.forward' },
      // Skills
      { action: 'press', label: 'Creativity', queryByText: true },
      { action: 'press', label: 'onboarding.welcome.forward' },
      // Sign up form is mocked
      { action: 'press', label: 'registration-submit-button' },
      // E-mail verification
      { action: 'paste', label: 'registration.emailVerification.inputLabel', input: '123456' },
      { action: 'press', label: 'registration.emailVerification.activateAccount' },
      // Name input
      { action: 'paste', label: 'onboarding.names.firstName.input.label', input: 'Ada' },
      { action: 'paste', label: 'onboarding.names.lastName.input.label', input: 'Lovelace' },
      { action: 'paste', label: 'user.profileForm.pronouns', input: 'she/her' },
      { action: 'press', label: 'onboarding.accountSetup.continue' },
    ])

    expectOnboardingCleanUp()
    expect(mockShowOnboardingFinishModal).toHaveBeenCalled()
  })

  it('should complete the whole flow with minimal inputs', async () => {
    await navigateThroughOnboarding([
      { action: 'press', label: 'onboarding.welcome.forward' },
      { action: 'press', label: 'global.next' },
      { action: 'press', label: 'onboarding.location.nextButtonLabel.skip' },
      { action: 'press', label: 'onboarding.interests.nextButtonLabel.skip' },
      { action: 'press', label: 'onboarding.skills.nextButtonLabel.skip' },
      { action: 'press', label: 'registration-submit-button' },
      { action: 'paste', label: 'registration.emailVerification.inputLabel', input: '123456' },
      { action: 'press', label: 'registration.emailVerification.activateAccount' },
      { action: 'paste', label: 'onboarding.names.firstName.input.label', input: 'Ada' },
      { action: 'press', label: 'onboarding.accountSetup.continue' },
    ])

    expectOnboardingCleanUp()
    expect(mockShowOnboardingFinishModal).toHaveBeenCalled()
  })

  it('should complete flow starting at account setup', async () => {
    mockUseOnboardingState.mockReturnValue('accountSetup')

    await navigateThroughOnboarding([
      { action: 'paste', label: 'onboarding.names.firstName.input.label', input: 'Ada' },
      { action: 'press', label: 'onboarding.accountSetup.continue' },
    ])

    expectOnboardingCleanUp()
    expect(mockShowOnboardingFinishModal).toHaveBeenCalled()
  })

  it('should skip all steps and continue as guest', async () => {
    await navigateThroughOnboarding([
      { action: 'press', label: 'onboarding.welcome.forward' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'auth.loginProtection.continueAsGuest' },
    ])

    expect(track).toHaveBeenCalledWith(
      TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'continueAsGuest' })
    )
    expectOnboardingCleanUp()
  })

  it('should fully track onboarding flow', async () => {
    // Prefill user data
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue({
      content: 'VOLUNTEERING',
      interests: ['ANIMAL_WELFARE'],
      skills: ['CREATIVITY'],
      location: testLocation,
    })

    await navigateThroughOnboarding([
      { action: 'press', label: 'onboarding.welcome.forward' },
      { action: 'press', label: 'global.next' },
      { action: 'press', label: 'onboarding.welcome.forward' },
      { action: 'press', label: 'onboarding.welcome.forward' },
      { action: 'press', label: 'onboarding.welcome.forward' },
      { action: 'press', label: 'registration-submit-button' },
      { action: 'paste', label: 'registration.emailVerification.inputLabel', input: '123456' },
      { action: 'press', label: 'registration.emailVerification.activateAccount' },
      { action: 'paste', label: 'onboarding.names.firstName.input.label', input: 'Ada' },
      { action: 'paste', label: 'onboarding.names.lastName.input.label', input: 'Lovelace' },
      { action: 'paste', label: 'user.profileForm.pronouns', input: 'she/her' },
      { action: 'press', label: 'onboarding.accountSetup.continue' },
    ])

    expect(track).toHaveBeenCalledWith(TrackingEvent.OnboardingStepCompleted('welcome', ['continue'], 'continue'))
    expect(track).toHaveBeenCalledWith(
      TrackingEvent.OnboardingStepCompleted('contentSelection', ['VOLUNTEERING'], 'continue')
    )
    expect(track).toHaveBeenCalledWith(
      TrackingEvent.OnboardingStepCompleted('locationSelection', ['Hamburg, Germany'], 'continue')
    )
    expect(track).toHaveBeenCalledWith(
      TrackingEvent.OnboardingStepCompleted('interestsSelection', ['animal-welfare'], 'continue')
    )
    expect(track).toHaveBeenCalledWith(
      TrackingEvent.OnboardingStepCompleted('skillsSelection', ['creativity'], 'continue')
    )
    expect(track).toHaveBeenCalledWith(
      TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'signUp' })
    )
    expect(track).toHaveBeenCalledWith(
      TrackingEvent.SignupStepCompleted({ step: 'verificationCode', answer: 'verifyAccount' })
    )
    expect(track).toHaveBeenCalledWith(TrackingEvent.SignupStepCompleted({ step: 'name', answer: 'continue' }))
  })

  it('should clear selection on skip', async () => {
    // Prefill user data
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue({
      content: 'VOLUNTEERING',
      interests: ['ANIMAL_WELFARE'],
      skills: ['CREATIVITY'],
      location: testLocation,
    })

    await navigateThroughOnboarding([
      { action: 'press', label: 'onboarding.welcome.forward' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'auth.loginProtection.continueAsGuest' },
    ])

    expect(storeOnboardingUserDataAsyncStore).toHaveBeenCalledWith({
      content: undefined,
      location: undefined,
      interests: [],
      skills: [],
    })
  })

  it('should track skip and back buttons', async () => {
    await navigateThroughOnboarding([
      { action: 'press', label: 'onboarding.welcome.forward' },
      { action: 'press', label: 'global.skip' },
      { action: 'press', label: 'global.back' },
    ])

    expect(track).toHaveBeenCalledWith(TrackingEvent.OnboardingStepCompleted('contentSelection', [], 'skip'))
    expect(track).toHaveBeenCalledWith(TrackingEvent.OnboardingStepCompleted('locationSelection', [], 'back'))
  })

  it('should track login', async () => {
    mockUseOnboardingState.mockReturnValue('finished')

    await navigateThroughOnboarding([{ action: 'press', label: 'auth.login' }])

    expect(track).toHaveBeenCalledWith(TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'login' }))
  })

  it('should track continuing as guest on email verification screen', async () => {
    setVerificationFlowData({ id: 'test', verifiable_address: 'test@example.com' })
    mockUseOnboardingState.mockReturnValue('emailVerification')

    const user = userEvent.setup()

    render(
      <MockedProvider mocks={mocks}>
        <Onboarding />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runOnlyPendingTimersAsync()
    })

    await user.press(screen.getByLabelText('auth.loginProtection.continueAsGuest'))

    expect(track).toHaveBeenCalledWith(
      TrackingEvent.SignupStepCompleted({ step: 'verificationCode', answer: 'continueAsGuest' })
    )
  })
})
