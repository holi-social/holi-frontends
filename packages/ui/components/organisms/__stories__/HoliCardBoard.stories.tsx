import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCardBoard from '@holi/ui/components/organisms/HoliCardBoard'

export default {
  title: 'Organisms/HoliCardBoard',
  component: HoliCardBoard,
} as ComponentMeta<typeof HoliCardBoard>

export const Example: ComponentStory<typeof HoliCardBoard> = () => (
  <>
    <HoliCardBoard>
      <Text>Hi folks!</Text>
    </HoliCardBoard>
    <HoliBox padding={25}>
      <HoliText bold>
        * This component is temporarily named HoliCardBoard. In the near future should replace the HoliCard and the
        HoliUserCard.
      </HoliText>
    </HoliBox>
  </>
)
