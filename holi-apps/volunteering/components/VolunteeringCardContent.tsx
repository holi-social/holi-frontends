import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import type { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'

type VolunteeringCardContentProps = {
  engagementOrReco: VolunteeringEngagement | VolunteeringReco
}

const hasTopics = (engagementOrReco: VolunteeringEngagement | VolunteeringReco) =>
  'engagement' in engagementOrReco
    ? engagementOrReco.matchedTopicsV2 && engagementOrReco.matchedTopicsV2?.length > 0
    : engagementOrReco.topicsV2 && engagementOrReco.topicsV2?.length > 0

const topics = (engagementOrReco: VolunteeringEngagement | VolunteeringReco) =>
  'engagement' in engagementOrReco ? engagementOrReco.matchedTopicsV2 : engagementOrReco.topicsV2

const hasSkills = (engagementOrReco: VolunteeringEngagement | VolunteeringReco) =>
  'engagement' in engagementOrReco
    ? engagementOrReco.matchedSkillsV2 && engagementOrReco.matchedSkillsV2?.length > 0
    : engagementOrReco.skillsV2 && engagementOrReco.skillsV2?.length > 0

const skills = (engagementOrReco: VolunteeringEngagement | VolunteeringReco) =>
  'engagement' in engagementOrReco ? engagementOrReco.matchedSkillsV2 : engagementOrReco.skillsV2

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
      <HoliText size={'default'} bold={true}>
        {title}
      </HoliText>
      <HoliGap size={'xxs'} />
      {!!engagement.location && (
        <View style={styles.locationContainer}>
          <HoliIcon icon={Globe} size={14} colorOverride={colors.foreground20} style={styles.locationIcon} />
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
  })
