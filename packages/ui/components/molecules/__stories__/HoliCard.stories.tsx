import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'

const users = Array.from(' '.repeat(6), (_, idx) => getRandomUser(!(idx % 2)))

export default {
  title: 'Molecules/HoliCard',
  component: HoliCard,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for cards.',
      },
    },
  },
} as Meta<typeof HoliCard>

const Template: StoryFn<typeof HoliCard> = ({ imageAspectRatio, ...props }) => {
  const containerWidth = imageAspectRatio === 1 ? 180 : 480

  return (
    <View style={{ maxWidth: containerWidth }}>
      <HoliCard imageAspectRatio={imageAspectRatio} {...props}>
        <HoliText style={{ textAlign: 'left' }}>Education</HoliText>
        <HoliText style={{ textAlign: 'left' }}>Reading to children after school in kreuzberg</HoliText>
      </HoliCard>
    </View>
  )
}

export const BasicExample: StoryFn<typeof HoliCard> = Template.bind({})
export const SecondaryVariant: StoryFn<typeof HoliCard> = Template.bind({})
export const TertiaryVariant: StoryFn<typeof HoliCard> = Template.bind({})

const defaultTypes = {
  imageUrl: { description: 'Image Url', required: true, control: { type: 'text' } },
  imageLabel: { description: 'Accessibility Label', control: { type: 'text' } },
  imageWidth: { description: 'Requested image width', control: { type: 'number' } },
  imageHeight: { description: 'Requested image width', control: { type: 'number' } },
  imageAspectRatio: { description: 'The image aspect ration', control: { type: 'number' } },
  hasBorder: { description: 'A variant with a border', control: { type: 'boolean' } },
  testID: { description: 'Test id', control: { type: 'text' } },
}

const defaultProps = {
  imageUrl: 'https://login.freiwilligenarbeit.de/api/v1/content_delivery/images/4620/volunteering-michigan-teaser.jpg',
  imageLabel: 'volunteering',
  imageWidth: 480,
  imageHeight: 320,
  testID: 'holiCard',
}

BasicExample.argTypes = { ...defaultTypes }
BasicExample.args = { ...defaultProps }
SecondaryVariant.argTypes = { ...defaultTypes }
SecondaryVariant.args = {
  ...defaultProps,
  hasBorder: true,
  caption: (
    <HoliUserAvatarPile users={users} usersToShow={3} usersTotal={users.length} counter collapse hasBackground />
  ),
}
TertiaryVariant.argTypes = { ...defaultTypes }
TertiaryVariant.args = { ...defaultProps, hasBorder: true, imageAspectRatio: 1 }
