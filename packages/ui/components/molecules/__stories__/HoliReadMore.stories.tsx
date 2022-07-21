import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore.web'

export default {
  title: 'Molecules/HoliReadMore',
  component: HoliReadMore,
} as ComponentMeta<typeof HoliReadMore>

const Template: ComponentStory<typeof HoliReadMore> = ({ ...args }) => {
  return (
    <View>
      <HoliText>Web version</HoliText>
      <HoliText style={{ marginTop: 5 }}>
        For web, changing props will only have an effect on the ellipsis (...) after clicking on the Read more / Read
        less button, or after refreshing the page.
      </HoliText>
      <HoliText>
        Please disconsider the border and padding below, those are not part of the HoliReadMore component.
      </HoliText>
      <View style={{ marginTop: 20, padding: 20, width: 500, borderColor: 'black', borderRadius: 5, borderWidth: 1 }}>
        <HoliReadMore {...args}></HoliReadMore>
      </View>
    </View>
  )
}

export const Primary: ComponentStory<typeof HoliReadMore> = Template.bind({})

Primary.argTypes = {
  children: { description: 'Text to be displayed in the component', type: 'string', control: { type: 'text' } },
  numberOfLines: { description: 'Number of lines to show', type: 'number', control: { type: 'number' } },
}

Primary.args = {
  numberOfLines: 3,
  children:
    'I enjoy working on community projects during my spare time. This text cannot exceed three lines or else. Holi is building a new digital home that makes it easy to come together and do good things for people and planet.',
}
