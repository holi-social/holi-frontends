import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { RegistrationForm } from '@holi/core/screens/auth/components/RegistrationForm'
import { useOtpRegistrationForm } from '@holi/core/screens/auth/form/hooks/useOtpRegistrationForm'
import { usePasswordRegistrationForm } from '@holi/core/screens/auth/form/hooks/usePasswordRegistrationForm'
import { useSocialRegistrationForm } from '@holi/core/screens/auth/form/hooks/useSocialRegistrationForm'
import { useRegistrationFlow } from '@holi/core/screens/auth/form/hooks/useRegistrationFlow'

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
      onResend: jest.fn(),
      trackingScreenName: 'mainRegistration',
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
    expect(screen.getByLabelText('auth.CTA.emailPassword')).toBeOnTheScreen()
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
    expect(screen.getByText('auth.login.forgotPassword')).toBeOnTheScreen()
    expect(screen.getByLabelText('auth.login.link.forgotPassword')).toBeOnTheScreen()
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
