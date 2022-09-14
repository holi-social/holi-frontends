import React from 'react'
import { View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type DonationListingProps = {
  data: Project[]
}

const DonationListing: React.VFC<DonationListingProps> = ({ data }: DonationListingProps) => {
  const { navigate } = useRouting()
  return (
    <View>
      {data &&
        data.map((entry) => (
          <HoliButton
            key={entry.id}
            label={entry.title}
            transparent
            onPress={() => navigate(`/apps/donations/${entry.id}`)}
          >
            <HoliText>{entry.title}</HoliText>
          </HoliButton>
        ))}
    </View>
  )
}

export default DonationListing
