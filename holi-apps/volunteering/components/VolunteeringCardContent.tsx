import { Text } from 'holi-bricks/components/text/Text'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'

type VolunteeringCardContentProps = {
  engagementOrReco: VolunteeringEngagement | VolunteeringReco
}

const hasTopics = (engagementOrReco: VolunteeringEngagement | VolunteeringReco) =>
  'engagement' in engagementOrReco
    ? engagementOrReco.matchedTopics && engagementOrReco.matchedTopics?.length > 0
    : engagementOrReco.topics && engagementOrReco.topics?.length > 0

const topics = (engagementOrReco: VolunteeringEngagement | VolunteeringReco) =>
  'engagement' in engagementOrReco ? engagementOrReco.matchedTopics : engagementOrReco.topics

const hasSkills = (engagementOrReco: VolunteeringEngagement | VolunteeringReco) =>
  'engagement' in engagementOrReco
    ? engagementOrReco.matchedSkills && engagementOrReco.matchedSkills?.length > 0
    : engagementOrReco.skills && engagementOrReco.skills?.length > 0

const skills = (engagementOrReco: VolunteeringEngagement | VolunteeringReco) =>
  'engagement' in engagementOrReco ? engagementOrReco.matchedSkills : engagementOrReco.skills

const VolunteeringCardContent: React.FC<VolunteeringCardContentProps> = ({ engagementOrReco }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const engagement = 'engagement' in engagementOrReco ? engagementOrReco.engagement : engagementOrReco

  const title = engagement.organizer?.name
    ? t('volunteering:engagement.title', {
        title: engagement.title,
        organization: engagement.organizer?.name,
        interpolation: { escapeValue: false },
      })
    : engagement.title

  // hardcoded for now as we don't have the country provided by the API yet
  const country = t('volunteering:engagement.country')
  return (
    <View testID="volunteering-list-item">
      {(hasTopics(engagementOrReco) || hasSkills(engagementOrReco)) && (
        <>
          <VolunteeringLabels
            displayAll={false}
            topicSlugs={topics(engagementOrReco)}
            skillSlugs={skills(engagementOrReco)}
          />
          <HoliGap size={'xs'} />
        </>
      )}
      <Text size={'lg'}>{title}</Text>
      <HoliGap size={'xxs'} />
      {!!engagement.location && (
        <View style={styles.locationContainer}>
          <HoliIcon icon={Globe} size={14} color={colors.foreground20} style={styles.locationIcon} />
          <Text size={'sm'} color={styles.locationText.color}>
            {engagement.location}, {country}
          </Text>
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
  })
