import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringCardContentProps = {
  engagement: VolunteeringEngagement
}

const VolunteeringCardContent: React.VFC<VolunteeringCardContentProps> = (props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const engagement = props.engagement

  const category = engagement.categories[0] // use just the first category for now due to design specification
  const { organizer } = engagement
  const title = organizer?.name
    ? t('volunteering:engagement.title', {
        title: engagement.title,
        organization: organizer?.name,
        interpolation: { escapeValue: false },
      })
    : engagement.title

  // hardcoded for now as we don't have the country provided by the API yet
  const country = t('volunteering:engagement.country')

  return (
    <View testID="volunteering-list-item">
      <HoliText size={'small'} style={styles.categoryText}>
        {category}
      </HoliText>
      <HoliText size={'default'} bold={true} style={styles.titleText}>
        {title}
      </HoliText>
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
      color: theme.colors.foreground20,
    },
    categoryText: {
      color: theme.colors.brandColorB30,
    },
  })
