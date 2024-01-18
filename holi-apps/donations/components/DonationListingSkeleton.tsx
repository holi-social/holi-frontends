import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface BaseProps {
  isFiltering?: boolean
  amount: number
}
interface SkeletonProps extends BaseProps {
  loading: true
}
interface Props extends BaseProps {
  loading?: false
}

type DonationListingSkeletonProps = SkeletonProps | Props

const DonationListingSkeleton: React.FC<DonationListingSkeletonProps> = ({ isFiltering, amount, ...props }) => {
  const postGridItemsInRow = useBreakpointMatcher()

  const skeletonItems = new Array(amount).fill(1).map((_, idx) => (
    <HoliGridCell key={idx}>
      <HoliSkeleton aspectRatio={327 / 214} borderRadius={24} height={'auto'} width={'100%'} />
      <HoliText size="extrasmall" style={styles.spaceTop} loading skeletonOptions={{ width: '40%' }} />
      <HoliHeading level="2" size="small" style={styles.topicTitle} loading skeletonOptions={{ width: '60%' }} />
      <HoliText size="extrasmall" style={{ marginTop: 8 }} loading skeletonOptions={{ width: '100%' }} />
    </HoliGridCell>
  ))

  const PartnerInfoRowSkeleton = () => (
    <View style={styles.partnerInfoRow}>
      <View style={styles.partnerImage}>
        <HoliSkeleton aspectRatio={1} borderRadius={20} height={41} width={41} />
      </View>
      <View style={{ flex: 3 }}>
        <HoliText loading skeletonOptions={{ width: '40%' }} />
      </View>
    </View>
  )

  return (
    <View style={styles.skeletonContainer} {...props}>
      <HoliHeading level="1" testID="donations-list-search-heading" loading skeletonOptions={{ width: '100%' }} />
      <PartnerInfoRowSkeleton />
      {isFiltering && <HoliText bold style={styles.searchQuery} loading skeletonOptions={{ width: '40%' }} />}
      <HoliGap />
      <HoliGridWrapper itemsInRow={postGridItemsInRow} gap={32}>
        {skeletonItems}
      </HoliGridWrapper>
    </View>
  )
}

export default withProfiler(DonationListingSkeleton, { name: 'DonationListingSkeleton' })

const styles = StyleSheet.create({
  topicTitle: {
    color: colors.brandColorB30,
    marginVertical: 8,
  },
  spaceTop: {
    marginTop: 16,

    width: '100%',
  },
  skeletonContainer: {
    marginVertical: 24,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    padding: 16,
    flex: 1,
  },
  heading: {
    marginBottom: 3,
  },
  searchQuery: {
    color: colors.brandColorB30,
    marginTop: 16,
  },
  partnerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  partnerImage: {
    borderRadius: 1 / 2,
    borderColor: colors.foreground30,
    overflow: 'hidden',
    marginRight: 8,
    marginLeft: 0,
  },
})
