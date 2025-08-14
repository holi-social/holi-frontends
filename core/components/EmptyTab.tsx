import React from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'

interface Props {
  text: string
  callToAction?: string
}

const EmptyTab = ({ callToAction, text }: Props) => {
  const { navigate } = useRouting()
  return (
    <HoliBox padding={[72, 56]} layout={{ alignItems: 'center' }}>
      <Text textAlign="center" color="support" size="md">
        {text}
      </Text>
      {callToAction !== undefined && (
        <HoliBox padding={[24, 0]} layout={{ maxWidth: 300 }}>
          <Button label={callToAction} onPress={() => navigate('/spaces')} />
        </HoliBox>
      )}
    </HoliBox>
  )
}

export default EmptyTab
