import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliContainer, { type ContainerProps } from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { colors } from '@holi/ui/styles/globalVars'

export default {
  title: 'Atoms/HoliContainer',
  parameters: {
    docs: {
      description: {
        component: 'HoliContainer - centers layout and includes responsive spacing.',
      },
    },
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
      defaultViewport: 'iphonexsmax',
    },
  },
} as Meta<typeof HoliContainer>

const Item = () => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: colors.brandColorB10,
        padding: 50,
        margin: 20,
      }}
    />
  )
}

export const Primary: StoryFn<typeof HoliContainer> = () => (
  <>
    <HoliContainer>
      <View style={{ padding: 20 }}>
        <HoliHeading size="s">Adjust the window dimensions on the tool bar.</HoliHeading>
      </View>
      <Item />
      <Item />
      <Item />
    </HoliContainer>
  </>
)

export const Secondary: StoryFn<typeof HoliContainer> = ({
  alignItems,
  flexDirection,
  justifyContent,
}: ContainerProps) => (
  <>
    <View style={{ padding: 20 }}>
      <HoliHeading size="s">Adjust the window dimensions on the tool bar.</HoliHeading>
    </View>
    <HoliContainer alignItems={alignItems} flexDirection={flexDirection} justifyContent={justifyContent}>
      <Item />
      <Item />
      <Item />
    </HoliContainer>
  </>
)

Secondary.args = {
  alignItems: 'flex-end',
  flexDirection: 'row',
  justifyContent: 'space-around',
}

Secondary.argTypes = {
  alignItems: {
    description: 'The same as the flexbox alignItems property',
    type: 'string',
    defaultValue: 'strech',
    control: { type: 'string' },
  },
  flexDirection: {
    description: 'The same as the flexbox flexDirection property',
    type: 'string',
    defaultValue: 'row',
    control: { type: 'string' },
  },
  justifyContent: {
    description: 'The same as the flexbox justifyContent property',
    type: 'string',
    defaultValue: 'space-around',
    control: { type: 'string' },
  },
}
