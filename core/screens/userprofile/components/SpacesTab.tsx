import React from 'react'

import type { Space } from '@holi/core/screens/spaces/types'
import type { Paged } from '@holi/core/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { vars } from '@holi/ui/styles/globalVars'

interface Props {
  spaces: Paged<Pick<Space, 'id' | 'name' | 'title' | 'cover' | 'members'>>
}

const SpacesTab = ({ spaces }: Props) => {
  return (
    <HoliBox padding={24}>
      {spaces.data.map((space) => (
        <HoliBox
          key={space.id}
          padding={[0, 0, 32, 0]}
          layout={{ maxWidth: vars.maxScreenWidth, width: '100%', alignSelf: 'center' }}
        >
          <HoliBlockItem
            label={space.title}
            title={space.title}
            imageSrc={space.cover}
            users={space.members.data.map((membership) => membership.user)}
            href={`/spaces/${space.name}`}
            testID="space-tab"
          />
        </HoliBox>
      ))}
    </HoliBox>
  )
}

export default SpacesTab
