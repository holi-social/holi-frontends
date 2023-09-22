import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

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

type VolunteeringListingSkeletonProps = SkeletonProps | Props

const VolunteeringListingSkeleton: React.FC<VolunteeringListingSkeletonProps> = ({ isFiltering, amount }) => {
  const postGridItemsInRow = useBreakpointMatcher()
  const mixins = useStyleMixins()
  const logoWidth = 41

  const skeletonItems = new Array(amount).fill(1).map((_, idx) => {
    return (
      <HoliGridCell key={idx}>
        <HoliSkeleton aspectRatio={327 / 214} borderRadius={24} height={'auto'} width={'100%'} />
        <HoliText size="extrasmall" style={styles.spaceTop} loading skeletonOptions={{ width: '40%' }} />
        <HoliHeading level="2" size="small" style={styles.topicTitle} loading skeletonOptions={{ width: '100%' }} />
        <HoliText size="extrasmall" style={{ marginTop: 8 }} loading skeletonOptions={{ width: '60%' }} />
      </HoliGridCell>
    )
  })

  const partnerSkeleton = new Array(5).fill(1).map((_, idx) => {
    const styles = getLogoStyles(logoWidth, idx)

    return (
      <View style={styles.partnerImage} key={idx}>
        <HoliSkeleton aspectRatio={1} borderRadius={20} height={logoWidth} width={logoWidth} />
      </View>
    )
  })

  return (
    <View style={[mixins.container, styles.container]}>
      <HoliBox padding={[0, 0, 24, 0]}>
        <>
          <HoliHeading level="1" loading skeletonOptions={{ width: '60%' }} />
        </>
        <View style={styles.partnerInfoRow}>
          {partnerSkeleton}
          <HoliText style={styles.spaceTop} loading skeletonOptions={{ width: '40%' }} />
        </View>
        {isFiltering && (
          <>
            <HoliText bold style={styles.searchQuery} loading skeletonOptions={{ width: '40%' }} />
          </>
        )}
      </HoliBox>
      <HoliGridWrapper itemsInRow={postGridItemsInRow} gap={32}>
        {skeletonItems}
      </HoliGridWrapper>
    </View>
  )
}

export default withProfiler(VolunteeringListingSkeleton, { name: 'VolunteeringListingSkeleton' })

const getLogoStyles = (logoWidth: number, idx: number) => {
  return StyleSheet.create({
    partnerImage: {
      borderRadius: logoWidth / 2,
      borderWidth: 1,
      borderColor: colors.background20,
      overflow: 'hidden',
      marginRight: 8,
      marginLeft: idx ? -24 : 0,
      zIndex: idx * -1,
    },
  })
}

const styles = StyleSheet.create({
  topicTitle: {
    color: colors.brandColorB30,
    marginTop: 8,
  },
  spaceTop: {
    marginTop: 8,
    width: '100%',
  },
  container: {
    paddingTop: 24,
    backgroundColor: colors.background20,
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
    alignItems: 'center',
    marginTop: 16,
  },
  list: {
    paddingTop: 24,
    backgroundColor: colors.background20,
  },
})
