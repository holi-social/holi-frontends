import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { Space } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { colors, vars } from '@holi/ui/styles/globalVars'

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
              <HoliBlockItem
                label={space.title}
                title={space.title}
                subtitle={space.location}
                description={space.description}
                imageSrc={space.mainImage}
                users={space.memberships.map((membership) => membership.user)}
                href={`/spaces/${space.id}`}
                size="large"
                testID="space-link"
                style={styles.backgroundWhite}
              />
            </HoliGridCell>
          ))
        }
      </HoliGridWrapper>
    </View>
  )
}

export default SpacesGrid

const styles = StyleSheet.create({
  backgroundWhite: {
    backgroundColor: colors.backgroundColor,
  },
})
