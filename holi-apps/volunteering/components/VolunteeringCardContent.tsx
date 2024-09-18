import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks/useVolunteeringVariant'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringCardContentProps = {
  engagement: VolunteeringEngagement
}

const VolunteeringCardContent: React.FC<VolunteeringCardContentProps> = ({ engagement }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const variant = useVolunteeringVariant()

  const { organizer } = engagement
  const title = organizer?.name
    ? t('volunteering:engagement.title', {
        title: engagement.title,
        organization: organizer?.name,
        interpolation: { escapeValue: false },
      })
    : engagement.title

  const hasTopics = engagement.matchedTopics && engagement.matchedTopics?.length > 0
  const hasSkills = engagement.matchedSkills && engagement.matchedSkills?.length > 0

  // hardcoded for now as we don't have the country provided by the API yet
  const country = t('volunteering:engagement.country')
  return (
    <View testID="volunteering-list-item">
      {variant === 'recosV1' && (hasTopics || hasSkills) && (
        <>
          <VolunteeringLabels displayAll={false} topicSlugs={engagement.topics} skillSlugs={engagement.skills} />
          <HoliGap size={'xs'} />
        </>
      )}
      {variant !== 'recosV1' && (
        <HoliText size={'small'} style={styles.categoryText} testID="volunteering-engagement-categories">
          {engagement.categories[0]}
        </HoliText>
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
    categoryText: {
      color: theme.colors.brandColorB30,
    },
  })
