import React from 'react'
import { StyleSheet, View } from 'react-native'

import { SafeAreaView } from '@holi/ui/components/safe-area'

import { PageHeader } from './components/pageHeader'

type CommunityLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const CommunityLayout: React.FunctionComponent<CommunityLayoutProps> = (props: CommunityLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <PageHeader accessibilityRole="region" accessibilityLabel="Page Header" />
      <View style={styles.contentView} accessibilityRole="main" accessibilityLabel="Main Content">
        {props.children}
      </View>
    </SafeAreaView>
  )
}

export default CommunityLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  contentView: {
    flex: 1,
  },
})
