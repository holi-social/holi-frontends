import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { Space } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { vars } from '@holi/ui/styles/globalVars'

type SpacesGridProps = {
  spaces: Space[]
  style?: StyleProp<ViewStyle>
}

const spaceBreakpointGridValues: [number, unknown][] = [
  [0, 2],
  [+vars.breakpointM, 3],
  [+vars.breakpointL, 4],
]

const SpacesGrid = ({ spaces, style }: PropsWithChildren<SpacesGridProps>) => {
  const itemsInRow = useBreakpointMatcher(spaceBreakpointGridValues)

  return (
    <View style={[style]}>
      <HoliGridWrapper itemsInRow={itemsInRow} gap={8}>
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          spaces.map((space) => (
            <HoliGridCell key={space.id}>
              <HoliBlockItem
                label={space.title}
                title={space.title}
                subtitle={space.location}
                description={space.description}
                imageSrc={space.cover}
                users={space.members.data.map((membership) => membership.user)}
                href={`/spaces/${space.name}`}
                size="large"
                testID="space-link"
                totalUserCount={space.members.totalResults}
              />
            </HoliGridCell>
          ))
        }
      </HoliGridWrapper>
    </View>
  )
}

export default SpacesGrid
