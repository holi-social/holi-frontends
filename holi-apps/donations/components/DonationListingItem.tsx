import React, { useMemo } from 'react'
import { Image, StyleSheet } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import { Project } from '@holi-apps/donations/typings'

import DonationProgress from './DonationProgress'

type DonationListingItemProps = {
  data: Project
}

const DonationListingItem: React.VFC<DonationListingItemProps> = ({ data }: DonationListingItemProps) => {
  const { title, categories, donationsCount, progressPercentage, openAmountInCents, picture } = data

  const responsiveImage = useMemo(() => {
    const original = picture.find(({ type }) => type === 'original')
    if (original === undefined) return

    return original && <Image source={{ uri: original.url }} style={styles.mainImage} /> // <Image source={{ uri: original.url }} style={{ width: '100', height: '100' }} />
  }, [picture])

  return (
    <>
      <HoliButton
        label={title}
        transparent
        onPress={() => console.log('navigate click')}
        style={styles.mainImageContainer}
        testID="feed-topic-image-link"
      >
        {responsiveImage}

        <HoliHeading level="2" selectable={true}>
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
    borderRadius: 18,
    marginBottom: 16,
    width: '100%',
  },
})
