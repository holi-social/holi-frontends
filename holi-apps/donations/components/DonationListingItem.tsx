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
  const styles = getStyles(small)

  return (
    <>
      {!small ? (
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
      ) : (
        <HoliButton
          label={title}
          transparent
          onPress={() => navigate(`/apps/donations/project/${project.id}`)}
          style={{ width: '90%' }}
          testID={'donations-list-item'}
        >
          <DonationImage picture={picture} label={title} style={styles.mainImage} />

          <HoliText size="small" numberOfLines={1}>
            {title}
          </HoliText>

          <DonationProgress
            category={categories[0]}
            donationsCount={donationsCount}
            progressPercentage={progressPercentage}
            openAmountInCents={openAmountInCents}
            size="small"
          />
        </HoliButton>
      )}
    </>
  )
}

export default DonationListingItem
const getStyles = (small = false) =>
  StyleSheet.create({
    mainImageContainer: {
      marginBottom: 40,
    },
    mainImage: {
      aspectRatio: !small ? 214 / 214 : 1,
      borderRadius: !small ? 24 : 10,
      marginBottom: 8,
      width: '100%',
    },
    heading: {
      marginBottom: 8,
    },
  })
