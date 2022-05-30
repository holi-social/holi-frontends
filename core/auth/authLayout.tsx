import React, { PropsWithChildren } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { SafeAreaView } from '@holi/ui/components/safe-area'

const AuthLayout: React.FunctionComponent = (props: PropsWithChildren<any>) => (
  <SafeAreaView style={styles.container}>
    <ScrollView>{props.children}</ScrollView>
  </SafeAreaView>
)

export default AuthLayout

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
