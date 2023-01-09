import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringCardContentProps = {
  engagement: VolunteeringEngagement
}

const VolunteeringCardContent: React.VFC<VolunteeringCardContentProps> = (props) => {
  const { t } = useTranslation()

  const engagement = props.engagement

  const category = engagement.uses[0]
  const title = engagement.orga
    ? t('volunteering:volunteering.organization', { title: engagement.title, organization: engagement.orga })
    : engagement.title

  return (
    <View testID="volunteering-list-item">
      <HoliText size={'small'} style={styles.categoryText}>
        {category}
      </HoliText>
      <HoliText size={'default'} bold={true} style={styles.titleText}>
        {title}
      </HoliText>
      {engagement.location && (
        <View style={styles.locationContainer}>
          <HoliIcon spinning={false} icon="globe" size={14} color={colors.fontColorGrey} style={styles.locationIcon} />
          <HoliText size={'small'} style={styles.locationText}>
            {engagement.location}
          </HoliText>
        </View>
      )}
    </View>
  )
}

export default VolunteeringCardContent

const styles = StyleSheet.create({
  volunteeringCardContainer: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  titleText: {
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    color: colors.fontColorGrey,
  },
  categoryText: {
    color: colors.fontColorHighlighted,
  },
})
