import React from 'react'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { Project } from '@holi-apps/donations/typings'

type DonationListingItemFilteredProps = {
  project: Project
}

const DonationListingItemFiltered: React.VFC<DonationListingItemFilteredProps> = ({
  project,
}: DonationListingItemFilteredProps) => {
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
      <View style={styles.container}>
        <DonationImage picture={picture} label={title} style={styles.mainImage} sizes="104px" />

        <View style={styles.textContainer}>
          <HoliHeading level="2" size="xSmall" selectable={true} style={styles.heading} numberOfLines={2}>
            {title}
          </HoliHeading>
          <DonationProgress
            category={categories[0]}
            donationsCount={donationsCount}
            progressPercentage={progressPercentage}
            openAmountInCents={openAmountInCents}
            size="small"
          />
        </View>
      </View>
    </HoliButton>
  )
}

export default DonationListingItemFiltered

const styles = StyleSheet.create({
  mainImageContainer: {
    backgroundColor: colors.backgroundColorGrey,
    borderRadius: 20,
    marginBottom: 16,
  },
  mainImage: {
    height: 104,
    width: 104,
    borderRadius: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  heading: {
    marginBottom: 3,
  },
})
