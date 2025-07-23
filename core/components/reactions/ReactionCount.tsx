import React from 'react'
import { View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SupportReaction } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'

export interface ReactionCountProps {
  count?: number
}

const ReactionCount = ({ count = 0 }: ReactionCountProps) => {
  if (count === 0) {
    return <View style={{ height: 26 }} />
  }

  return (
    <Stack direction="row" alignItems="center">
      <Text selectable={false} size="xs" color="default" bold margin={{ right: '4xs' }}>
        {count}
      </Text>
      <HoliIcon icon={SupportReaction} size={26} />
    </Stack>
  )
}

export default ReactionCount
