import React from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

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
          <HoliButton label={callToAction} onPress={() => navigate('/spaces')}>
            {callToAction}
          </HoliButton>
        </HoliBox>
      )}
    </HoliBox>
  )
}

export default EmptyTab
