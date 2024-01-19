import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliDivider from '@holi/ui/components/atoms/HoliDivider'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { Card } from '@holi/ui/components/organisms/HoliCardBoard/Card'
import { Slot } from '@holi/ui/components/organisms/HoliCardBoard/Slot'

// TODO: Import compound components individually as Storybook has a problem rendering object compounds components.

export default {
  title: 'Organisms/HoliCardBoard',
  component: Card,
} as ComponentMeta<typeof Card>

export const Example: ComponentStory<typeof Card> = () => {
  return (
    <View style={{ maxWidth: '343px' }}>
      <Card>
        <Slot>
          <HoliAvatar
            imageSrc=""
            label="Grace Brewster Hopper"
            initials="GH"
            defaultColor="#FE9000"
            size="large"
            loading={false}
          />
          <View>
            <HoliHeading size="m">Grace Brewster Hopper</HoliHeading>
            <HoliText color="gray300">She/Her</HoliText>
          </View>
          <HoliColumns>
            <HoliColumn width="auto">
              <HoliButton label="">Start Chatting</HoliButton>
            </HoliColumn>
          </HoliColumns>
        </Slot>
        <HoliDivider />
        <Slot>
          <HoliText color="gray300">They want to start a new conversation with you.</HoliText>
          <HoliButton label="" type="secondary">
            Reject
          </HoliButton>
        </Slot>
      </Card>
      <HoliBox padding={25}>
        <HoliText bold>
          * This component is temporarily named HoliCardBoard. In the near future should replace the HoliCard and the
          HoliUserCard.
        </HoliText>
      </HoliBox>
    </View>
  )
}
