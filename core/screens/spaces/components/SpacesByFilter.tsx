import { useQuery } from '@apollo/client'
import React, { memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
// import SpacesSlider from '@holi/core/screens/spaces/components/SpacesSlider'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import { SpaceFilter } from '@holi/core/screens/spaces/types'

const SPACES_PAGE_SIZE = 10

type SpacesByFilterProps = {
  filter: SpaceFilter
  style?: StyleProp<ViewStyle>
}

const SpacesByFilter: React.VFC<SpacesByFilterProps> = ({ filter }: SpacesByFilterProps) => {
  // const { totalResults = 0, data: spacesData = [] } = spaces || {}

  const { data, error } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      ...filter,
      limit: SPACES_PAGE_SIZE,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (!data) {
    return <></>
  }

  if (error) {
    logError(error, `[SpacesByFilter.tsx] ${error.message}`)
  }

  // const { data: spaces = [], totalResults = 0 } = data?.spaces || {}

  // const canFetchMore = spaces.length < totalResults

  // Error state just hides the component
  if (error) {
    return <></>
  }

  return (
    <></>
    // <SpacesSlider
    //   topic={topic}
    //   style={style}
    //   spaces={spacesData.slice(0, SPACES_PAGE_SIZE)}
    //   paddingVertical={8}
    //   slideGap={8}
    //   hasMore={totalResults > SPACES_PAGE_SIZE}
    // />
  )
}

export default memo(SpacesByFilter)
