import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { RegistrationForm } from '@holi/core/screens/auth/components/RegistrationForm'
import { useOtpRegistrationForm } from '@holi/core/screens/auth/form/hooks/useOtpRegistrationForm'
import { usePasswordRegistrationForm } from '@holi/core/screens/auth/form/hooks/usePasswordRegistrationForm'
import { useSocialRegistrationForm } from '@holi/core/screens/auth/form/hooks/useSocialRegistrationForm'
import { useRegistrationFlow } from '@holi/core/screens/auth/form/hooks/useRegistrationFlow'
import { TrackingEvent } from '@holi/core/tracking'

const mockUseOtpRegistrationForm = jest.mocked(useOtpRegistrationForm)
jest.mock('@holi/core/screens/auth/form/hooks/useOtpRegistrationForm', () => ({
  useOtpRegistrationForm: jest.fn(),
}))
const mockUsePasswordRegistrationForm = jest.mocked(usePasswordRegistrationForm)
jest.mock('@holi/core/screens/auth/form/hooks/usePasswordRegistrationForm', () => ({
  usePasswordRegistrationForm: jest.fn(),
}))
const mockUseSocialRegistrationForm = jest.mocked(useSocialRegistrationForm)
jest.mock('@holi/core/screens/auth/form/hooks/useSocialRegistrationForm', () => ({
  useSocialRegistrationForm: jest.fn(),
}))
const mockUseRegistrationFlow = jest.mocked(useRegistrationFlow)
jest.mock('@holi/core/screens/auth/form/hooks/useRegistrationFlow', () => ({
  useRegistrationFlow: jest.fn(),
}))

jest.useFakeTimers()

describe('RegistrationForm', () => {
  const mockFlow = {
    id: '123',
    expires_at: '',
    issued_at: '',
    request_url: '',
    state: '',
    type: 'api',
    ui: {
      action: '',
      method: '',
      nodes: [],
    },
  }

  beforeEach(() => {
    mockUseOtpRegistrationForm.mockReturnValue({
      email: 'test@foo.bar',
      setEmail: jest.fn(),
      onChangeEmail: jest.fn(),
      setCode: jest.fn(),
      submitLabel: 'Send code',
      onSubmit: jest.fn(),
      submitDisabled: false,
      trackingScreen: 'mainRegistration',
    })
    mockUsePasswordRegistrationForm.mockReturnValue({
      setEmail: jest.fn(),
      setPassword: jest.fn(),
      submitLabel: 'Create account',
      onSubmit: jest.fn(),
      submitDisabled: false,
    })
    mockUseSocialRegistrationForm.mockReturnValue({
      onSubmit: jest.fn(),
    })
    mockUseRegistrationFlow.mockReturnValue({
      flow: mockFlow,
      performRegistration: jest.fn(),
      resetFlow: jest.fn(),
      usePasswordLabel: 'Use password',
    })
  })

  it('should pass the correct props', () => {
    const startedFlowId = '123'
    const resetFlowId = jest.fn()
    const performRegistration = jest.fn()
    const resetFlow = jest.fn()
    const onRegister = jest.fn()
    mockUseRegistrationFlow.mockReturnValue({
      flow: mockFlow,
      performRegistration,
      resetFlow,
      usePasswordLabel: 'Use password',
    })

    render(
      <RegistrationForm
        startedFlowId={startedFlowId}
        resetFlowId={resetFlowId}
        step="start"
        setStep={jest.fn()}
        onRegister={onRegister}
      />
    )

    expect(mockUseRegistrationFlow).toHaveBeenCalledWith({
      startedFlowId,
      onFlowUpdate: expect.any(Function),
      resetFlowId,
      onRegister,
    })
    expect(mockUseSocialRegistrationForm).toHaveBeenCalledWith({
      flow: mockFlow,
      performRegistration,
    })
    expect(mockUseOtpRegistrationForm).toHaveBeenCalledWith({
      flow: mockFlow,
      performRegistration,
      resetFlow,
    })
    expect(mockUsePasswordRegistrationForm).toHaveBeenCalledWith({
      flow: mockFlow,
      performRegistration,
    })
  })

  it('should render correct form for start step', () => {
    render(<RegistrationForm resetFlowId={jest.fn()} step="start" setStep={jest.fn()} />)

    // Expect two social login buttons
    expect(screen.getAllByText('auth.login.input.label-ProviderSignIn')).toHaveLength(2)

    expect(screen.getByText('auth.divider.email')).toBeOnTheScreen()

    // Expect EmailOtpForm with custom button label
    expect(screen.getByLabelText('auth.login.input.label-Email')).toBeOnTheScreen()
    expect(screen.getByLabelText('Send code')).toBeOnTheScreen()

    // Expect button to use password instead
    expect(screen.getByLabelText('Use password')).toBeOnTheScreen()
  })

  it('should render correct form for code step', () => {
    render(<RegistrationForm resetFlowId={jest.fn()} step="code" setStep={jest.fn()} />)

    // Expect CodeOtpForm
    expect(screen.getByText('test@foo.bar')).toBeOnTheScreen()
    expect(screen.getByLabelText('global.edit')).toBeOnTheScreen()
    expect(screen.getByLabelText('auth.login.input.label-SignInCode')).toBeOnTheScreen()
    expect(screen.getByLabelText('auth.login.cta.verifyEmail')).toBeOnTheScreen()
    expect(screen.getByText('registration.emailVerification.resendInstruction')).toBeOnTheScreen()
    expect(screen.getByLabelText('registration.emailVerification.resendEmail')).toBeOnTheScreen()
  })

  it('should render correct form for email-password step', () => {
    render(<RegistrationForm resetFlowId={jest.fn()} step="email-password" setStep={jest.fn()} />)

    // Expect two social login buttons
    expect(screen.getAllByText('auth.login.input.label-ProviderSignIn')).toHaveLength(2)

    expect(screen.getByText('auth.divider.email')).toBeOnTheScreen()

    // Expect EmailPasswordForm with custom submit label
    expect(screen.getByLabelText('auth.login.input.label-Email')).toBeOnTheScreen()
    expect(screen.getByLabelText('auth.login.input.label-Password')).toBeOnTheScreen()
    expect(screen.getByLabelText('Create account')).toBeOnTheScreen()
    // Do NOT expect option to reset password
    expect(screen.queryByText('auth.login.forgotPassword')).not.toBeOnTheScreen()
    expect(screen.queryByLabelText('auth.login.link.forgotPassword')).not.toBeOnTheScreen()
  })

  it('should switch to password step on button press', async () => {
    const setEmail = jest.fn()
    mockUsePasswordRegistrationForm.mockReturnValue({
      setEmail,
      setPassword: jest.fn(),
      submitLabel: 'Create account',
      onSubmit: jest.fn(),
      submitDisabled: false,
    })
    const setStep = jest.fn()
    const user = userEvent.setup()

    render(<RegistrationForm resetFlowId={jest.fn()} step="start" setStep={setStep} />)

    await user.press(screen.getByLabelText('Use password'))

    expect(setStep).toHaveBeenCalledWith('email-password')
    expect(setEmail).toHaveBeenCalledWith('test@foo.bar')
  })

  it('should track password usage on button press', async () => {
    const user = userEvent.setup()

    render(<RegistrationForm resetFlowId={jest.fn()} step="start" setStep={jest.fn()} />)

    await user.press(screen.getByLabelText('Use password'))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.Auth.RegistrationOptionSelected({
        method: 'password',
        screen: 'mainRegistration',
      })
    )
  })

  it('should update step if necessary', () => {
    const setStep = jest.fn()
    render(<RegistrationForm resetFlowId={jest.fn()} step="start" setStep={setStep} />)

    mockUseRegistrationFlow.mock.calls[0][0].onFlowUpdate({
      ...mockFlow,
      active: 'code',
      state: 'sent_email',
    })

    expect(setStep).toHaveBeenCalledWith('code')
  })

  it('should not update step if not necessary', () => {
    const setStep = jest.fn()
    render(<RegistrationForm resetFlowId={jest.fn()} step="start" setStep={setStep} />)

    mockUseRegistrationFlow.mock.calls[0][0].onFlowUpdate(mockFlow)

    expect(setStep).not.toHaveBeenCalled()
  })
})
