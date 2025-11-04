import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { LoginForm } from '@holi/core/screens/auth/components/LoginForm'
import { useOtpLoginForm } from '@holi/core/screens/auth/form/hooks/useOtpLoginForm'
import { usePasswordLoginForm } from '@holi/core/screens/auth/form/hooks/usePasswordLoginForm'
import { useSocialLoginForm } from '@holi/core/screens/auth/form/hooks/useSocialLoginForm'
import { useLoginFlow } from '@holi/core/screens/auth/form/hooks/useLoginFlow'

const mockUseOtpLoginForm = jest.mocked(useOtpLoginForm)
jest.mock('@holi/core/screens/auth/form/hooks/useOtpLoginForm', () => ({
  useOtpLoginForm: jest.fn(),
}))
const mockUsePasswordLoginForm = jest.mocked(usePasswordLoginForm)
jest.mock('@holi/core/screens/auth/form/hooks/usePasswordLoginForm', () => ({
  usePasswordLoginForm: jest.fn(),
}))
const mockUseSocialLoginForm = jest.mocked(useSocialLoginForm)
jest.mock('@holi/core/screens/auth/form/hooks/useSocialLoginForm', () => ({
  useSocialLoginForm: jest.fn(),
}))
const mockUseLoginFlow = jest.mocked(useLoginFlow)
jest.mock('@holi/core/screens/auth/form/hooks/useLoginFlow', () => ({
  useLoginFlow: jest.fn(),
}))

jest.useFakeTimers()

describe('LoginForm', () => {
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
    mockUseOtpLoginForm.mockReturnValue({
      email: 'test@foo.bar',
      setEmail: jest.fn(),
      onChangeEmail: jest.fn(),
      setCode: jest.fn(),
      submitLabel: 'Send code',
      onSubmit: jest.fn(),
      submitDisabled: false,
      onResend: jest.fn(),
    })
    mockUsePasswordLoginForm.mockReturnValue({
      setEmail: jest.fn(),
      setPassword: jest.fn(),
      submitLabel: 'Log in',
      onSubmit: jest.fn(),
      submitDisabled: false,
    })
    mockUseSocialLoginForm.mockReturnValue({
      onSubmit: jest.fn(),
    })
    mockUseLoginFlow.mockReturnValue({
      flow: mockFlow,
      performLogin: jest.fn(),
      resetFlow: jest.fn(),
    })
  })

  it('should pass the correct props', () => {
    const startedFlowId = '123'
    const resetFlowId = jest.fn()
    const performLogin = jest.fn()
    const resetFlow = jest.fn()
    mockUseLoginFlow.mockReturnValue({
      flow: mockFlow,
      performLogin,
      resetFlow,
    })

    render(<LoginForm startedFlowId={startedFlowId} resetFlowId={resetFlowId} step="start" setStep={jest.fn()} />)

    expect(mockUseLoginFlow).toHaveBeenCalledWith({
      startedFlowId,
      onFlowUpdate: expect.any(Function),
      resetFlowId,
    })
    expect(mockUseSocialLoginForm).toHaveBeenCalledWith({
      flow: mockFlow,
      performLogin,
    })
    expect(mockUseOtpLoginForm).toHaveBeenCalledWith({
      flow: mockFlow,
      performLogin,
      resetFlow,
    })
    expect(mockUsePasswordLoginForm).toHaveBeenCalledWith({
      flow: mockFlow,
      performLogin,
    })
  })

  it('should render correct form for start step', () => {
    render(<LoginForm resetFlowId={jest.fn()} step="start" setStep={jest.fn()} />)

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
    render(<LoginForm resetFlowId={jest.fn()} step="code" setStep={jest.fn()} />)

    // Expect CodeOtpForm
    expect(screen.getByText('test@foo.bar')).toBeOnTheScreen()
    expect(screen.getByLabelText('global.edit')).toBeOnTheScreen()
    expect(screen.getByLabelText('registration.emailVerification.inputPlaceholder')).toBeOnTheScreen()
    expect(screen.getByLabelText('tasks.register.unlogged.verify.email')).toBeOnTheScreen()
    expect(screen.getByText('registration.emailVerification.resendInstruction')).toBeOnTheScreen()
    expect(screen.getByLabelText('registration.emailVerification.resendEmail')).toBeOnTheScreen()
  })

  it('should render correct form for email-password step', () => {
    render(<LoginForm resetFlowId={jest.fn()} step="email-password" setStep={jest.fn()} />)

    // Expect two social login buttons
    expect(screen.getAllByText('auth.login.input.label-ProviderSignIn')).toHaveLength(2)

    expect(screen.getByText('auth.divider.email')).toBeOnTheScreen()

    // Expect EmailPasswordForm with custom submit label
    expect(screen.getByLabelText('auth.login.input.label-Email')).toBeOnTheScreen()
    expect(screen.getByLabelText('auth.login.input.label-Password')).toBeOnTheScreen()
    expect(screen.getByLabelText('Log in')).toBeOnTheScreen()
    expect(screen.getByText('auth.login.forgotPassword')).toBeOnTheScreen()
    expect(screen.getByLabelText('auth.login.link.forgotPassword')).toBeOnTheScreen()
  })

  it('should update step if necessary', () => {
    const setStep = jest.fn()
    render(<LoginForm resetFlowId={jest.fn()} step="start" setStep={setStep} />)

    mockUseLoginFlow.mock.calls[0][0].onFlowUpdate({
      ...mockFlow,
      active: 'code',
      state: 'sent_email',
    })

    expect(setStep).toHaveBeenCalledWith('code')
  })

  it('should not update step if not necessary', () => {
    const setStep = jest.fn()
    render(<LoginForm resetFlowId={jest.fn()} step="start" setStep={setStep} />)

    mockUseLoginFlow.mock.calls[0][0].onFlowUpdate(mockFlow)

    expect(setStep).not.toHaveBeenCalled()
  })
})
