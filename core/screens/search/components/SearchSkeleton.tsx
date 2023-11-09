import React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

interface Props {
  pageSize: number
}
const SearchSkeleton = ({ pageSize }: Props) => {
  return new Array(pageSize).fill(1).map((_, idx) => {
    return (
      <View style={[styles.flex, styles.listItem]} key={idx}>
        <HoliBox padding={[0, 16, 0, 0]}>
          <HoliAvatar size="medium" loading />
        </HoliBox>
        <View style={styles.flex}>
          <HoliText loading skeletonOptions={{ width: '60%' }} />
        </View>
      </View>
    )
  })
}

export default SearchSkeleton

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  nameRow: {
    maxWidth: 300,
  },
})
