import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { useTheme } from '@holi/ui/styles/theme'

export default {
  title: 'Atoms/HoliGap',
  component: HoliGap,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for spacing between components.',
      },
    },
  },
} as ComponentMeta<typeof HoliGap>
const Template: ComponentStory<typeof HoliGap> = ({ ...args }) => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View
      style={{
        backgroundColor: colors.error200,
        display: 'inline-block',
      }}
    >
      <HoliGap {...args} direction="horizontal" />
      <HoliGap {...args} direction="vertical" />
    </View>
  )
}

export const BasicExample: ComponentStory<typeof HoliGap> = Template.bind({})

BasicExample.argTypes = {
  size: {
    description: 'Spacing size',
    required: false,
    options: ['xs', 's', 'm', 'l', 'xl'],
    control: { type: 'select' },
  },
}

BasicExample.args = {
  size: 'm',
}
