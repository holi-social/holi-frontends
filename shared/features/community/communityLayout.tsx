import React from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'

type CommunityLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const CommunityLayout: React.FunctionComponent<CommunityLayoutProps> = (props: CommunityLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>{props.children}</View>
    </SafeAreaView>
  )
}

export default CommunityLayout

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginTop: 100,
  },
  scrollView: {},
})
