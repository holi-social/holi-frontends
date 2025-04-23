import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { SocialLoginButton } from 'holi-bricks/components/button'
import React from 'react'

import { View } from 'react-native'

const availableProviders = ['Google', 'Facebook', 'Apple'] as const

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
  render: function Render(args) {
    return (
      <>
        {availableProviders.map((provider) => (
          <View key={provider} style={{ margin: 6 }}>
            <SocialLoginButton {...args} provider={provider} label={`Continue with ${provider}`} />
          </View>
        ))}
      </>
    )
  },
}

export const ByState: Story = {
  render: function Render() {
    return (
      <>
        <View style={{ margin: 6 }}>
          <SocialLoginButton label="loading" loading provider="Google" />
        </View>
        <View style={{ margin: 6 }}>
          <SocialLoginButton label="disabled" disabled provider="Google" />
        </View>
        <View style={{ margin: 6 }}>
          <SocialLoginButton label="selected" selected provider="Google" />
        </View>
      </>
    )
  },
}

export default meta
