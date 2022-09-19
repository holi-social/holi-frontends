import React, { useMemo } from 'react'
import { Image, StyleSheet } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { Project } from '@holi-apps/donations/typings'

// TODO(SF) scroll layout broken

type DonationListingItemProps = {
  project: Project
}

const DonationListingItem: React.VFC<DonationListingItemProps> = ({ project }: DonationListingItemProps) => {
  const { title, categories, donationsCount, progressPercentage, openAmountInCents, picture } = project

  // TODO(SF) not small?
  const responsiveImage = useMemo(() => {
    const original = picture.find(({ type }) => type === 'original')
    if (!original) return

    // TODO(SF) a11y label
    return original && <Image source={{ uri: original.url }} style={styles.mainImage} />
  }, [picture])

  return (
    <>
      <HoliButton
        label={title}
        transparent
        onPress={() => console.log('navigate click')}
        style={styles.mainImageContainer}
      >
        {responsiveImage}

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
    </>
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
