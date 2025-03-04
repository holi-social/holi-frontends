import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import LocationContainer from '@holi-apps/volunteering/components/LocationContainer'
import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import type { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringDetailHeaderProps = {
  engagement: VolunteeringEngagement
  imageWidth: number
}

const VolunteeringDetailHeader = ({ engagement, imageWidth }: VolunteeringDetailHeaderProps) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const hasTopics = engagement.topicsV2 && engagement.topicsV2?.length > 0
  const hasSkills = engagement.skillsV2 && engagement.skillsV2?.length > 0

  const uri = engagement.imageUrl
  return (
    <View style={styles.container}>
      <HoliImage source={uri ? { uri, width: imageWidth } : []} label={engagement.title} style={styles.image} />
      <View style={styles.detailContainer}>
        {(hasTopics || hasSkills) && (
          <>
            <VolunteeringLabels displayAll={true} topicSlugs={engagement.topicsV2} skillSlugs={engagement.skillsV2} />
            <HoliGap size={'sm'} />
          </>
        )}
        <HoliHeading level="1" size="l" testID="volunteering-engagement-title">
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: theme.colors.background10,
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
  })
