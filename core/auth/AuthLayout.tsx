import React, { PropsWithChildren } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import SafeArea from '@holi/ui/components/SafeArea'

const AuthLayout: React.FunctionComponent = (props: PropsWithChildren<any>) => (
  <SafeArea style={styles.container}>
    <ScrollView>{props.children}</ScrollView>
  </SafeArea>
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
