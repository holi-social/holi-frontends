import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { SocialLoginButton } from 'holi-bricks/components/button'
import { Stack } from 'holi-bricks/components/stack'
import React from 'react'

const availableProviders = ['Google', 'Facebook', 'Apple'] as const
const availableStates = ['loading', 'disabled', 'selected']

const disabledProps = [
  'accessible',
  'id',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'tabIndex',
  'onPress',
  'testID',
  'tabIndex',
]

const meta: Meta<typeof SocialLoginButton> = {
  title: 'Components/Button/SocialLoginButton',
  component: SocialLoginButton,
  argTypes: {
    label: { description: 'Button text', required: false },
    provider: { control: 'select', options: availableProviders },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    label: 'Label',
    provider: 'Google',
  },
}

type Story = StoryObj<typeof SocialLoginButton>

export const Default: Story = {
  argTypes: {
    label: { description: 'Button text', required: false },
  },
  args: {
    label: 'Label',
    loading: false,
    disabled: false,
    selected: false,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const handlePress = () => {
      updateArgs({ selected: true })
    }
    return <SocialLoginButton {...args} onPress={handlePress} />
  },
}

export const ByProvider: Story = {
  args: {
    label: 'Label',
    loading: false,
    disabled: false,
    selected: false,
  },
  render: function Render(args) {
    return (
      <Stack gap="xxs">
        {availableProviders.map((provider) => (
          <SocialLoginButton key={provider} {...args} provider={provider} label={`Continue with ${provider}`} />
        ))}
      </Stack>
    )
  },
}

export const ByState: Story = {
  args: {
    label: 'Label',
    loading: false,
    disabled: false,
    selected: false,
    provider: 'Google',
  },
  render: function Render(args) {
    return (
      <Stack gap="xxs">
        {availableStates.map((state) => (
          <SocialLoginButton key={state} {...args} label={state} {...{ [state]: true }} />
        ))}
      </Stack>
    )
  },
}

export default meta
