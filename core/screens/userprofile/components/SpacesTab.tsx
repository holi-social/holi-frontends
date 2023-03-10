import React from 'react'

import type { Space } from '@holi/core/screens/spaces/types'
import type { Paged } from '@holi/core/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'

interface Props {
  spaces: Paged<Pick<Space, 'id' | 'title' | 'cover' | 'members'>>
}

const SpacesTab = ({ spaces }: Props) => {
  return (
    <HoliBox padding={24}>
      {spaces.data.map((space) => (
        <HoliBox key={space.id} padding={[0, 0, 32, 0]}>
          <HoliBlockItem
            label={space.title}
            title={space.title}
            imageSrc={space.cover}
            users={space.members.data.map((membership) => membership.user)}
            href={`/spaces/${space.id}`}
            testID="space-tab"
          />
        </HoliBox>
      ))}
    </HoliBox>
  )
}

export default SpacesTab
