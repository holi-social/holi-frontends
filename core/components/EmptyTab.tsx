import React from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'

interface Props {
  text: string
  callToAction?: string
}

const EmptyTab = ({ callToAction, text }: Props) => {
  const { navigate } = useRouting()
  return (
    <HoliBox
      padding={[72, 56]}
      layout={{ maxWidth: dimensions.maxScreenWidth, width: '100%', alignItems: 'center', alignSelf: 'center' }}
    >
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
