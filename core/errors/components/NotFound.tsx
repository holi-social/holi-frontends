import React from 'react'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const NotFound: React.VFC = () => {
  const mixins = useStyleMixins()

  return (
    <DefaultLayout>
      <View style={[mixins.container, styles.container]}>
        <HoliText>404</HoliText>
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginTop: 100,
  },
})

export default NotFound
