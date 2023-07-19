import React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

import LocationContainer from '@holi-apps/volunteering/components/LocationContainer'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringDetailHeaderProps = {
  engagement: VolunteeringEngagement
  imageWidth: number
}

const VolunteeringDetailHeader: React.FC<VolunteeringDetailHeaderProps> = ({
  engagement,
  imageWidth,
}: VolunteeringDetailHeaderProps) => {
  const uri = engagement.imageUrl
  return (
    <View style={styles.container}>
      <HoliImage source={uri ? { uri, width: imageWidth } : []} label={engagement.title} style={styles.image} />
      <View style={styles.detailContainer}>
        <HoliText size={'small'} style={styles.categoryText}>
          {engagement.categories[0]}
        </HoliText>
        <HoliHeading level="1" size={'large'} style={{ fontWeight: '400' }}>
          {engagement.title}
        </HoliHeading>
        {!!engagement.location && (
          <LocationContainer
            locationName={engagement.location}
            iconColor={colors.foreground30}
            fontColor={colors.foreground30}
          />
        )}
      </View>
    </View>
  )
}

export default VolunteeringDetailHeader

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    paddingBottom: 26,
    marginTop: 0,
  },
  detailContainer: {
    paddingTop: 40,
    paddingRight: 24,
    paddingLeft: 24,
  },
  image: {
    aspectRatio: 1.5,
    width: '100%',
  },
  categoryText: {
    color: colors.brandColorB30,
  },
  titleText: {
    marginTop: 8,
  },
})
