import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { HEADER_HEIGHT, HEADER_MARGIN } from '@holi/ui/styles/globalVars/constants'

type CommunityLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const CommunityLayout: React.FunctionComponent<CommunityLayoutProps> = (props: CommunityLayoutProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.scrollView}>{props.children}</View>
    </View>
  )
}

export default CommunityLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    ...Platform.select({
      web: {
        paddingTop: HEADER_HEIGHT + HEADER_MARGIN,
      },
    }),
  },
  scrollView: {},
})
