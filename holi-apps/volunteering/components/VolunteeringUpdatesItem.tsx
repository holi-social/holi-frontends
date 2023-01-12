import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringUpdatesItemProps = {
  engagement: VolunteeringEngagement
  style?: StyleProp<ViewStyle>
}

const VolunteeringUpdatesItem: React.VFC<VolunteeringUpdatesItemProps> = ({
  engagement,
  style,
}: VolunteeringUpdatesItemProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)
  const { t } = useTranslation()

  const { organizer } = engagement
  const title = organizer?.name
    ? t('volunteering:engagement.title', { title: engagement.title, organization: organizer?.name })
    : engagement.title

  return (
    <HoliButton
      label={title}
      transparent
      // onPress={() => navigate(`/apps/volunteering/${engagement.id}`)} TODO: use this once volunteering detail view is ready
      style={[styles.buttonContainer, style]}
      testID={'goodnews-updates-item'}
      inline
    >
      <HoliImage source={{ uri: engagement.imageUrl }} label={title} sizes="180px" style={styles.mainImage} />

      <HoliText size="small" bold numberOfLines={2} selectable style={{ marginTop: 16 }}>
        {title}
      </HoliText>
      <HoliText size="small" numberOfLines={2} selectable style={{ marginTop: 8, color: 'grey' }}>
        {engagement.location}
      </HoliText>
    </HoliButton>
  )
}

export default VolunteeringUpdatesItem

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    buttonContainer: {
      width: Platform.OS === 'web' ? 160 : screenWidth / 2 - 26,
      marginRight: 12,
    },
    mainImage: {
      aspectRatio: 1,
      borderRadius: 8,
      height: Platform.OS === 'web' ? '100%' : 'auto',
    },
  })
