import React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

import LocationContainer from '@holi-apps/volunteering/components/LocationContainer'

type VolunteeringDetailImageContainerProps = {
  imageUrl: string
  category: string
  title: string
  location?: string
}

const VolunteeringDetailImageContainer: React.VFC<VolunteeringDetailImageContainerProps> = ({
  imageUrl,
  category,
  title,
  location,
}: VolunteeringDetailImageContainerProps) => {
  return (
    <View style={styles.container}>
      <HoliImage source={{ uri: imageUrl }} label={title} style={styles.image} />
      <View style={styles.detailContainer}>
        <HoliText size={'small'} style={styles.categoryText}>
          {category}
        </HoliText>
        <HoliHeading level="1" size={'large'} style={{ fontWeight: '400' }}>
          {title}
        </HoliHeading>
        {location && (
          <LocationContainer
            locationName={location}
            iconColor={colors.backgroundColorModalDark}
            fontColor={colors.backgroundColorModalDark}
          />
        )}
      </View>
    </View>
  )
}

export default VolunteeringDetailImageContainer

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
    color: colors.fontColorHighlighted,
  },
  titleText: {
    marginTop: 8,
  },
})
