import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliReadMore from '@holi/ui/components/HoliReadMore'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export default {
  title: 'Components/HoliReadMore',
  component: HoliReadMore,
} as ComponentMeta<typeof HoliReadMore>

const Template: ComponentStory<typeof HoliReadMore> = ({ ...args }) => {
  return (
    <View>
      <HoliText type={HoliTextType.heading1}>Web version (Read more button in new line)</HoliText>
      <HoliText type={HoliTextType.body} styles={[{ marginTop: 5 }]}>
        For web, changing props will only have an effect on the ellipsis (...) after clicking on the Read more / Read
        less button, or after refreshing the page.
      </HoliText>
      <HoliText type={HoliTextType.body}>
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
    'I enjoy working on community projects during my spare time. This text cannot exceed three lines or else. This text cannot exceed three lines or else. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
}
