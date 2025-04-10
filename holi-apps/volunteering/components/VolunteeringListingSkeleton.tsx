import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface Props {
  isFiltering?: boolean
  amount: number
}

const VolunteeringListingSkeleton = ({ isFiltering, amount }: Props) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const mixins = useStyleMixins()
  const logoWidth = 41

  const skeletonItems = new Array(amount).fill(1).map((_, idx) => {
    return (
      <HoliGridCell key={idx}>
        <HoliSkeleton aspectRatio={327 / 214} borderRadius={24} height={'auto'} width={'100%'} />
        <HoliText size="extrasmall" style={styles.spaceTop} loading skeletonOptions={{ width: '40%' }} />
        <HoliGap size="xs" />
        <HoliHeading level="2" size="s" loading skeletonOptions={{ width: '100%' }} />
        <HoliText size="extrasmall" style={{ marginTop: 8 }} loading skeletonOptions={{ width: '60%' }} />
      </HoliGridCell>
    )
  })

  const partnerSkeleton = new Array(5).fill(1).map((_, idx) => {
    const styles = getLogoStyles(logoWidth, idx, theme)

    return (
      <View style={styles.partnerImage} key={idx}>
        <HoliSkeleton aspectRatio={1} borderRadius={20} height={logoWidth} width={logoWidth} />
      </View>
    )
  })

  return (
    <View style={[mixins.container, styles.container]} testID="volunteering-list-skeleton">
      <HoliHeading level="2" size="l" loading skeletonOptions={{ width: '60%' }} />
      <View style={styles.partnerInfoRow}>
        {partnerSkeleton}
        <HoliText style={styles.spaceTop} loading skeletonOptions={{ width: '40%' }} />
      </View>
      {isFiltering && <HoliText bold style={styles.searchQuery} loading skeletonOptions={{ width: '40%' }} />}
      <HoliGap />
      <HoliGridWrapper gap={32}>{skeletonItems}</HoliGridWrapper>
    </View>
  )
}

export default withProfiler(VolunteeringListingSkeleton, { name: 'VolunteeringListingSkeleton' })

const getLogoStyles = (logoWidth: number, idx: number, theme: HoliTheme) => {
  return StyleSheet.create({
    partnerImage: {
      borderRadius: logoWidth / 2,
      borderWidth: 1,
      borderColor: theme.colors.background20,
      overflow: 'hidden',
      marginRight: 8,
      marginLeft: idx ? -24 : 0,
      zIndex: idx * -1,
    },
  })
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    spaceTop: {
      marginTop: 8,
      width: '100%',
    },
    container: {
      paddingTop: 24,
      backgroundColor: theme.colors.background20,
    },
    searchQuery: {
      color: theme.colors.brandColorB30,
      marginTop: 16,
    },
    partnerInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    },
  })
