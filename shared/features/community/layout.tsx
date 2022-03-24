import React from 'react'
import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native'
import useRouting from 'shared/components/navigation/useRouting'

type CommunityLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const CommunityLayout: React.FunctionComponent<CommunityLayoutProps> = (props: CommunityLayoutProps) => {
  const { navigate } = useRouting()

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
