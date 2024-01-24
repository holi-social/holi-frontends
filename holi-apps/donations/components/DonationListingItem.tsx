import React from 'react'
import { StyleSheet } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { Project } from '@holi-apps/donations/typings'

type DonationListingItemProps = {
  project: Project
}

const DonationListingItem: React.VFC<DonationListingItemProps> = ({ project }: DonationListingItemProps) => {
  const { navigate } = useRouting()
  const { title, categories, progressPercentage, openAmountInCents, picture } = project
  const { imageWidth } = useWindowDimensionsWithImageScaling()
  // requesting the correct aspect ratio, for correct cropping, lowering bandwidth
  const imageHeight = Math.ceil(imageWidth / styles.mainImage.aspectRatio)

  return (
    <HoliButton
      label={title}
      transparent
      onPress={() => navigate(`/apps/donations/project/${project.id}`)}
      testID={'donations-list-item'}
    >
      <DonationImage picture={picture} label={title} style={styles.mainImage} width={imageWidth} height={imageHeight} />

      <HoliHeading level="2" size="s" selectable>
        {title}
      </HoliHeading>
      <HoliGap size="xs" />
      <DonationProgress
        category={categories[0]}
        progressPercentage={progressPercentage}
        openAmountInCents={openAmountInCents}
      />
    </HoliButton>
  )
}

export default DonationListingItem

const styles = StyleSheet.create({
  mainImage: {
    aspectRatio: 327 / 214,
    borderRadius: 24,
    marginBottom: 8,
    width: '100%',
  },
})
