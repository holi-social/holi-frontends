import React from 'react'
import { StyleSheet } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { Project } from '@holi-apps/donations/typings'

type DonationListingItemProps = {
  project: Project
  small?: boolean
}

const DonationListingItem: React.VFC<DonationListingItemProps> = ({
  project,
  small = false,
}: DonationListingItemProps) => {
  const { navigate } = useRouting()
  const { title, categories, donationsCount, progressPercentage, openAmountInCents, picture } = project

  return (
    <HoliButton
      label={title}
      transparent
      onPress={() => navigate(`/apps/donations/project/${project.id}`)}
      style={!small ? styles.mainImageContainer : styles.smallImageContainer}
      testID={'donations-list-item'}
      inline={small}
    >
      <DonationImage picture={picture} label={title} style={!small ? styles.mainImage : styles.smallImage} />

      {!small ? (
        <HoliHeading level="2" size="small" selectable style={styles.heading}>
          {title}
        </HoliHeading>
      ) : (
        <HoliText size="small" bold numberOfLines={2} selectable style={{ marginTop: 8 }}>
          {title}
        </HoliText>
      )}
      <DonationProgress
        category={categories[0]}
        donationsCount={donationsCount}
        progressPercentage={progressPercentage}
        openAmountInCents={openAmountInCents}
        size={!small ? 'default' : 'small'}
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
  smallImage: {
    borderRadius: 10,
    marginBottom: 8,
    width: 160,
    height: 160,
  },
  heading: {
    marginBottom: 8,
  },
  smallImageContainer: {
    marginRight: 11,
    height: 'auto',
    width: 160,
  },
})
