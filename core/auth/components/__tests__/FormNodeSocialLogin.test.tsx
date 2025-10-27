import React from 'react'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { FormNodeSocialLogin } from '@holi/core/auth/components/FormNodeSocialLogin'
import type { UiNode } from '@ory/kratos-client'
import { render, screen, userEvent } from 'expo-router/testing-library'
const mockUseFeatureFlagToggle = jest.mocked(useFeatureFlagToggle)
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlagToggle', () => ({
  useFeatureFlagToggle: jest.fn(),
}))

jest.unmock('@holi/core/auth/helpers/auth')

const createNode = ({
  provider = 'Google',
  providerId,
  disabled = false,
}: { provider?: string; providerId?: string; disabled?: boolean } = {}): UiNode => ({
  attributes: {
    disabled,
    name: 'provider',
    node_type: 'input',
    type: 'submit',
    value: providerId ?? provider.toLowerCase() + '_123',
  },
  group: 'link',
  messages: [],
  meta: {
    label: {
      context: {
        provider,
      },
      id: 1010002,
      text: '',
      type: 'success',
    },
  },
  type: 'input',
})

describe('FormNodeSocialLogin', () => {
  beforeEach(() => {
    mockUseFeatureFlagToggle.mockReturnValue(true)
  })

  it('should render nothing if the feature flag is disabled', () => {
    mockUseFeatureFlagToggle.mockReturnValue(false)

    render(<FormNodeSocialLogin node={createNode()} translationPrefix={'auth.login.'} onSubmitPress={jest.fn()} />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should render nothing if the provider id is missing', () => {
    render(
      <FormNodeSocialLogin
        node={createNode({ providerId: '' })}
        translationPrefix={'auth.login.'}
        onSubmitPress={jest.fn()}
      />
    )

    expect(screen.toJSON()).toBeNull()
  })

  it('should render nothing if the provider is missing', () => {
    render(
      <FormNodeSocialLogin
        node={createNode({ provider: '' })}
        translationPrefix={'auth.login.'}
        onSubmitPress={jest.fn()}
      />
    )

    expect(screen.toJSON()).toBeNull()
  })

  it('should render nothing if the provider is not supported', () => {
    render(
      <FormNodeSocialLogin
        node={createNode({ provider: 'Unsupported' })}
        translationPrefix={'auth.login.'}
        onSubmitPress={jest.fn()}
      />
    )

    expect(screen.toJSON()).toBeNull()
  })

  it('should disable button', () => {
    render(
      <FormNodeSocialLogin
        node={createNode({ disabled: true })}
        translationPrefix={'auth.login.'}
        onSubmitPress={jest.fn()}
      />
    )

    expect(screen.getByLabelText('auth.login.input.label-ProviderSignIn')).toBeDisabled()
  })

  it('should render the social login button for google', () => {
    render(<FormNodeSocialLogin node={createNode()} translationPrefix={'auth.login.'} onSubmitPress={jest.fn()} />)

    expect(screen.getByLabelText('auth.login.input.label-ProviderSignIn')).toBeOnTheScreen()
  })

  it('should call onSubmitPress callback with the correct parameters for google', async () => {
    const onSubmitPress = jest.fn()
    const user = userEvent.setup()
    render(<FormNodeSocialLogin node={createNode()} translationPrefix={'auth.login.'} onSubmitPress={onSubmitPress} />)

    await user.press(screen.getByLabelText('auth.login.input.label-ProviderSignIn'))

    expect(onSubmitPress).toHaveBeenCalledWith(
      {
        method: 'oidc',
        provider: 'google_123',
        upstream_parameters: {
          prompt: 'select_account',
        },
      },
      'Google'
    )
  })

  it('should render the social login button for apple', () => {
    render(
      <FormNodeSocialLogin
        node={createNode({ provider: 'Apple' })}
        translationPrefix={'auth.login.'}
        onSubmitPress={jest.fn()}
      />
    )

    expect(screen.getByLabelText('auth.login.input.label-ProviderSignIn')).toBeOnTheScreen()
  })

  it('should call onSubmitPress callback with the correct parameters for apple', async () => {
    const onSubmitPress = jest.fn()
    const user = userEvent.setup()
    render(
      <FormNodeSocialLogin
        node={createNode({ provider: 'Apple' })}
        translationPrefix={'auth.login.'}
        onSubmitPress={onSubmitPress}
      />
    )

    await user.press(screen.getByLabelText('auth.login.input.label-ProviderSignIn'))

    expect(onSubmitPress).toHaveBeenCalledWith(
      {
        method: 'oidc',
        provider: 'apple_123',
      },
      'Apple'
    )
  })
})
