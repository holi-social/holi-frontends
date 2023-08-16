import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Text, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliDivider from '@holi/ui/components/atoms/HoliDivider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { Card } from '@holi/ui/components/organisms/HoliCardBoard/Card'
import { Slot } from '@holi/ui/components/organisms/HoliCardBoard/Slot'

// TODO: Import compound components individually as Storybook has a problem rendering object compounds components.

export default {
  title: 'Organisms/HoliCardBoard',
  component: Card,
} as ComponentMeta<typeof Card>

export const Example: ComponentStory<typeof Card> = () => (
  <View style={{ maxWidth: '343px' }}>
    <Card>
      <Slot>
        <Text>Hi folks!</Text>
      </Slot>
      <HoliDivider />
    </Card>
    <HoliBox padding={25}>
      <HoliText bold>
        * This component is temporarily named HoliCardBoard. In the near future should replace the HoliCard and the
        HoliUserCard.
      </HoliText>
    </HoliBox>
  </View>
)
