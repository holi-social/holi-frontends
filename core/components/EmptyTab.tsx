import React from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { Button } from 'holi-bricks/components/button'

interface Props {
  text: string
  callToAction?: string
}

const EmptyTab = ({ callToAction, text }: Props) => {
  const { navigate } = useRouting()
  return (
    <HoliBox padding={[72, 56]} layout={{ alignItems: 'center' }}>
      <HoliText align="center" color="gray300">
        {text}
      </HoliText>
      {callToAction !== undefined && (
        <HoliBox padding={[24, 0]} layout={{ maxWidth: 300 }}>
          <Button label={callToAction} onPress={() => navigate('/spaces')} />
        </HoliBox>
      )}
    </HoliBox>
  )
}

export default EmptyTab
