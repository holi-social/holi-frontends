import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'

type DonationListingProps = {
  data: Project[]
}

const DonationListing: React.VFC<DonationListingProps> = ({ data }: DonationListingProps) => (
  <View>{data && data.map((entry) => <HoliText key={entry.id}>{entry.title}</HoliText>)}</View>
)

export default DonationListing
