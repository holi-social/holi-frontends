import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { Space } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { dimensions } from '@holi/ui/styles/globalVars'

interface BaseProps {
  spaces: Space[]
  style?: StyleProp<ViewStyle>
}

interface SkeletonProps extends Partial<BaseProps> {
  loading: true
  pageSize: number
}

interface Props extends BaseProps {
  loading?: false
  pageSize?: number
}

type SpacesGridProps = SkeletonProps | Props

const spaceBreakpointGridValues: [number, number][] = [
  [0, 2],
  [dimensions.breakpointM, 3],
  [dimensions.breakpointL, 4],
]

const SpacesGrid = ({ loading, spaces, style, pageSize }: PropsWithChildren<SpacesGridProps>) => {
  const itemsInRow = useBreakpointMatcher(spaceBreakpointGridValues) ?? 2
  // approximation, because of padding images are a bit to large, but that's ok
  const { imageWidth } = useWindowDimensionsWithImageScaling({ relativeWidth: 1 / itemsInRow })

  return (
    <View style={[style]}>
      <HoliGridWrapper itemsInRow={itemsInRow} gap={8}>
        {loading &&
          new Array(pageSize).fill(1).map((_, idx) => {
            return (
              <HoliGridCell key={idx} testID={idx === 0 ? 'spaces-grid-cell-skeleton' : undefined}>
                <HoliBlockItem size="large" loading={true} />
              </HoliGridCell>
            )
          })}

        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          !loading &&
            spaces.map((space) => (
              <HoliGridCell key={space.id}>
                <HoliBlockItem
                  label={space.title}
                  title={space.title}
                  subtitle={space.location}
                  description={space.description}
                  imageSrc={space.cover}
                  imageBlurhash={space.coverBlurhash}
                  users={space.members.data.map((membership) => membership.user)}
                  href={`/spaces/${space.name}`}
                  size="large"
                  testID="space-link"
                  totalUserCount={space.members.totalResults}
                  cardWidthForImageScaling={imageWidth}
                />
              </HoliGridCell>
            ))
        }
      </HoliGridWrapper>
    </View>
  )
}

export default SpacesGrid
