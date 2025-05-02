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
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

type VolunteeringCardContentProps = {
  engagement: LocalizedTypesenseDocument
}

const VolunteeringCardContent: React.FC<VolunteeringCardContentProps> = ({ engagement }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const title = engagement.organizer_name
    ? t('volunteering:engagement.title', {
        title: engagement.title,
        organization: engagement.organizer_name,
        interpolation: { escapeValue: false },
      })
    : engagement.title

  // hardcoded for now as we don't have the country provided by the API yet
  const country = t('volunteering:engagement.country')
  return (
    <View testID="volunteering-list-item">
      {(engagement.topics_v2?.length || engagement.skills_v2?.length) && (
        <>
          <VolunteeringLabels displayAll={false} topicSlugs={engagement.topics_v2} skillSlugs={engagement.skills_v2} />
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
