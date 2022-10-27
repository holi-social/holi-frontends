import React from 'react'
import { Platform, StyleProp, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { Project } from '@holi-apps/donations/typings'

type DonationUpdatesItemProps = {
  project: Project
  style?: StyleProp<ViewStyle>
}

const DonationUpdatesItem: React.VFC<DonationUpdatesItemProps> = ({ project, style }: DonationUpdatesItemProps) => {
  const { navigate } = useRouting()
  const { title, categories, donationsCount, progressPercentage, openAmountInCents, picture } = project
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <HoliButton
      label={title}
      transparent
      onPress={() => navigate(`/apps/donations/project/${project.id}`)}
      style={[styles.buttonContainer, style]}
      testID={'donations-updates-item'}
      inline
    >
      <DonationImage picture={picture} label={title} sizes="180px" style={styles.mainImage} />

      <HoliText size="small" numberOfLines={2} selectable style={{ marginTop: 16 }}>
        {title}
      </HoliText>
      <DonationProgress
        category={categories[0]}
        donationsCount={donationsCount}
        progressPercentage={progressPercentage}
        openAmountInCents={openAmountInCents}
        size={'small'}
      />
    </HoliButton>
  )
}

export default DonationUpdatesItem

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
