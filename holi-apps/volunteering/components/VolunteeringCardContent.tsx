import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import FilterPill from '@holi/core/components/FilterPill'
import { Skill, Topic } from '@holi/core/domain/shared/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { labelsForListings } from '@holi-apps/volunteering/helpers'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringCardContentProps = {
  engagement: VolunteeringEngagement
  topics: readonly Topic[]
  skills: readonly Skill[]
}

const VolunteeringCardContent: React.FC<VolunteeringCardContentProps> = ({ engagement, topics, skills }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { organizer } = engagement
  const title = organizer?.name
    ? t('volunteering:engagement.title', {
        title: engagement.title,
        organization: organizer?.name,
        interpolation: { escapeValue: false },
      })
    : engagement.title

  const { topicLabel, topicLabelCount, skillLabel, skillLabelCount } = labelsForListings(
    engagement.topics,
    engagement.skills,
    topics,
    skills
  )

  // hardcoded for now as we don't have the country provided by the API yet
  const country = t('volunteering:engagement.country')

  return (
    <View testID="volunteering-list-item">
      {!!topicLabel && (
        <>
          <View style={styles.labelRow}>
            <FilterPill small label={topicLabel} filterType="topic" style={styles.pill} />
            {!!topicLabelCount && (
              <FilterPill small label={'+' + topicLabelCount} filterType="topic" style={styles.pill} />
            )}
          </View>
          <HoliGap size={'xxs'} />
        </>
      )}
      {!!skillLabel && (
        <>
          <View style={styles.labelRow}>
            <FilterPill small label={skillLabel} filterType="skill" style={styles.pill} />
            {!!skillLabelCount && (
              <FilterPill small label={'+' + skillLabelCount} filterType="skill" style={styles.pill} />
            )}
          </View>
          <HoliGap size={'xs'} />
        </>
      )}
      <HoliText size={'default'} bold={true}>
        {title}
      </HoliText>
      <HoliGap size={'xxs'} />
      {!!engagement.location && (
        <View style={styles.locationContainer}>
          <HoliIcon icon={Globe} size={14} color={colors.foreground20} style={styles.locationIcon} />
          <HoliText size={'small'} style={styles.locationText}>
            {engagement.location}, {country}
          </HoliText>
        </View>
      )}
    </View>
  )
}

export default VolunteeringCardContent

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationIcon: {
      marginRight: 5,
    },
    locationText: {
      color: theme.colors.foreground20,
    },
    labelRow: {
      flexDirection: 'row',
      gap: 6,
    },
    pill: {
      flexShrink: 1,
    },
  })
