import React from 'react'
import { View } from 'react-native'

import TopicSlider from '@holi/core/screens/spaces/components/TopicSlider'
import { FilteredSpacesResponse } from '@holi/core/screens/spaces/queries'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

type SpacesListingProps = {
  data: FilteredSpacesResponse
}

const SpacesListing: React.VFC<SpacesListingProps> = ({ data }) => {
  return (
    <>
      {data.matchedSpaces.length ? (
        <View style={{ marginBottom: 12 }}>
          {data.matchedSpaces.map((entry) => (
            <TopicSlider key={`unmatched_${entry.id}`} {...entry} />
          ))}
        </View>
      ) : (
        <HoliText>No Matches</HoliText>
      )}

      {data.unmatchedSpaces.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <HoliHeading size="large" style={{ marginBottom: 24 }}>
            {t('spaces.otherListing')}
          </HoliHeading>
          {data.unmatchedSpaces.map((entry) => (
            <TopicSlider key={`unmatched_${entry.id}`} {...entry} />
          ))}
        </View>
      )}
    </>
  )
}

export default SpacesListing
