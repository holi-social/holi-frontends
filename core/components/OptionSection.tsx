import React from 'react'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'

interface Props {
  title: string
  description: string
  value?: boolean
  onChange: (value: boolean) => void
}

const OptionSection = ({ title, description, value = false, onChange }: Props) => {
  return (
    <HoliBox padding={[8, 16, 16, 16]}>
      <HoliBox
        padding={[8, 0]}
        layout={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <HoliHeading level="3" size="s">
          {title}
        </HoliHeading>

        <HoliGap direction="horizontal" size="s" />

        <HoliSwitch value={value} onChange={onChange} />
      </HoliBox>

      <HoliGap direction="vertical" size="xs" />

      <HoliText>{description}</HoliText>
    </HoliBox>
  )
}

export default OptionSection
