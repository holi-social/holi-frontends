import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'
import { colors } from '@holi/ui/styles/globalVars'

const users = Array.from(' '.repeat(6), (_, idx) => getRandomUser(!(idx % 2)))

export default {
  title: 'Molecules/HoliBlockItem',
  component: HoliBlockItem,
} as ComponentMeta<typeof HoliBlockItem>

const Template: ComponentStory<typeof HoliBlockItem> = ({ ...args }) => {
  return (
    <div style={{ backgroundColor: colors.backgroundColorGrey, padding: 20 }}>
      <div style={{ display: 'flex', width: 300 }}>
        <HoliBlockItem
          {...args}
          label=""
          style={args.size === 'large' ? { backgroundColor: colors.backgroundColor } : {}}
        />
      </div>
    </div>
  )
}

export const Primary: ComponentStory<typeof HoliBlockItem> = Template.bind({})

Primary.argTypes = {
  size: { description: 'Size', control: { type: 'radio', options: ['small', 'large'] } },
  title: { description: 'Title', type: 'string', control: { type: 'text' } },
  subtitle: { description: 'Subtitle', type: 'string', control: { type: 'text' } },
  description: { description: 'Description', type: 'string', control: { type: 'text' } },
  imageSrc: {
    description: 'Url to the image',
    type: 'string',
    options: ['https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg', undefined],
    control: { type: 'select' },
  },
  users: { description: 'Array of users', required: true, control: { type: 'Array' } },
  href: { description: 'Link target', type: 'string', control: { type: 'text' } },
}

Primary.args = {
  size: 'small',
  title: 'Saving the foxes',
  subtitle: 'Hamburg, Germany',
  description:
    'We want to make sure foxes are not driven to more urban areas on their quest for food. Help us save the fox population and preserve their natural habitats.',
  imageSrc: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
  users,
  href: '#',
}
