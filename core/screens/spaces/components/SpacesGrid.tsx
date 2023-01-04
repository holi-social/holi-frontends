import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import SpaceCard from '@holi/core/screens/spaces/components/SpaceCard'
import { Space } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
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

const SpacesGrid: React.VFC<SpacesGridProps> = ({ spaces, style }: SpacesGridProps) => {
  const itemsInRow = useBreakpointMatcher(spaceBreakpointGridValues)

  return (
    <View style={[style]}>
      <HoliGridWrapper itemsInRow={itemsInRow} gap={8}>
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          spaces.map((space) => (
            <HoliGridCell key={space.id}>
              <SpaceCard space={space} size="small" />
            </HoliGridCell>
          ))
        }
      </HoliGridWrapper>
    </View>
  )
}

export default SpacesGrid
