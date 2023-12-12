import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'

interface Props {
  width?: '40%' | '60%'
}

const SearchSkeleton = ({ width = '60%', children }: PropsWithChildren<Props>) => (
  <View style={[styles.flex, styles.listItem]}>
    <HoliBox padding={[0, 16, 0, 0]}>{children}</HoliBox>

    <View style={styles.flex}>
      <HoliText loading skeletonOptions={{ width }} />
    </View>
  </View>
)

export default SearchSkeleton

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  nameRow: {
    maxWidth: 300,
  },
})
