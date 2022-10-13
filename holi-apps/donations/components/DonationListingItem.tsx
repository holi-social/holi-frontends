import React from 'react'
import { StyleSheet } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { Project } from '@holi-apps/donations/typings'

type DonationListingItemProps = {
  project: Project
}

const DonationListingItem: React.VFC<DonationListingItemProps> = ({ project }: DonationListingItemProps) => {
  const { navigate } = useRouting()
  const { title, categories, donationsCount, progressPercentage, openAmountInCents, picture } = project

  return (
    <HoliButton
      label={title}
      transparent
      onPress={() => navigate(`/apps/donations/project/${project.id}`)}
      style={styles.mainImageContainer}
      testID={'donations-list-item'}
    >
      <DonationImage picture={picture} label={title} style={styles.mainImage} />

      <HoliHeading level="2" size="small" selectable={true} style={styles.heading}>
        {title}
      </HoliHeading>

      <DonationProgress
        category={categories[0]}
        donationsCount={donationsCount}
        progressPercentage={progressPercentage}
        openAmountInCents={openAmountInCents}
      />
    </HoliButton>
  )
}

export default DonationListingItem

const styles = StyleSheet.create({
  mainImageContainer: {
    marginBottom: 40,
  },
  mainImage: {
    aspectRatio: 327 / 214,
    borderRadius: 24,
    marginBottom: 8,
    width: '100%',
  },
  heading: {
    marginBottom: 8,
  },
})
