import React from 'react'
import { View } from 'react-native'

import type { MessageSection } from '@holi/chat/src/components/RoomMessageList/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'

interface Props {
  messageSection: MessageSection
}

const RoomMessageSection = ({ messageSection }: Props) => (
  <HoliBox padding={[32, 0, 4, 0]}>
    <View style={{ alignItems: 'center' }}>
      <HoliText size="extrasmall" color="gray300">
        {messageSection.title}
      </HoliText>
    </View>
  </HoliBox>
)

export default RoomMessageSection
