import type { PropsWithChildren } from 'react'
import React from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import type { Space } from '@holi/api/graphql/graphql-codegen'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import type { User } from '@holi/core/domain/shared/types'

interface Props {
  spaces: Space[]
  pageSize?: number
  style?: StyleProp<ViewStyle>
}

const gridBreakpoints: [number, number][] = [
  [0, 2],
  [dimensions.breakpointM, 3],
  [dimensions.breakpointL, 4],
]

const SpacesGrid = ({ loading, spaces, style, pageSize = 1 }: PropsWithChildren<PropsWithSkeleton<Props>>) => {
  const itemsInRow = useBreakpointMatcher(gridBreakpoints) ?? 2
  // approximation, because of padding images are a bit to large, but that's ok
  const { imageWidth } = useWindowDimensionsWithImageScaling({ relativeWidth: 1 / itemsInRow })

  return (
    <View style={[style]}>
      <HoliGridWrapper breakpoints={gridBreakpoints} gap={8}>
        {loading
          ? new Array(pageSize).fill(1).map((_, idx) => (
              <HoliGridCell key={idx} testID={idx === 0 ? 'spaces-grid-cell-skeleton' : undefined}>
                <HoliBlockItem size="large" loading={true} />
              </HoliGridCell>
            ))
          : spaces.map((space) => (
              <HoliGridCell key={space.id}>
                <HoliBlockItem
                  label={space.title}
                  title={space.title}
                  subtitle={space.location}
                  description={space.description}
                  imageSrc={space.cover}
                  imageBlurhash={space.coverBlurhash}
                  users={space.members.data.map((membership) => membership.user) as User[]}
                  href={`/spaces/${space.name}`}
                  size="large"
                  testID="space-link"
                  totalUserCount={space.members.totalResults}
                  cardWidthForImageScaling={imageWidth}
                />
              </HoliGridCell>
            ))}
      </HoliGridWrapper>
    </View>
  )
}

export default SpacesGrid
