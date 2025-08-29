import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props {
  isFiltering?: boolean
  amount: number
}

const DonationListingSkeleton = ({ isFiltering, amount, ...props }: Props) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const skeletonItems = new Array(amount).fill(1).map((_, idx) => (
    <HoliGridCell key={idx}>
      <HoliSkeleton aspectRatio={327 / 214} borderRadius={24} height={'auto'} width={'100%'} />
      <HoliText size="extrasmall" style={styles.spaceTop} loading skeletonOptions={{ width: '40%' }} />
      <HoliGap size="xs" />
      <HoliHeading level="2" size="s" loading skeletonOptions={{ width: '60%' }} />
      <HoliGap size="xs" />
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
      <HoliHeading
        level="2"
        size="l"
        testID="donations-list-search-heading"
        loading
        skeletonOptions={{ width: '100%' }}
      />
      <PartnerInfoRowSkeleton />
      {isFiltering && <HoliText bold style={styles.searchQuery} loading skeletonOptions={{ width: '40%' }} />}
      <HoliGap />
      <HoliGridWrapper gap={32}>{skeletonItems}</HoliGridWrapper>
    </View>
  )
}

export default withProfiler(DonationListingSkeleton, { name: 'DonationListingSkeleton' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      color: theme.colors.brandColorB30,
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
      borderColor: theme.colors.foreground30,
      overflow: 'hidden',
      marginRight: 8,
      marginLeft: 0,
    },
  })
