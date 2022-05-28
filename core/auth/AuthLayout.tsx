import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { SafeAreaView } from '@holi/ui/components/safe-area'

type AuthLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const AuthLayout: React.FunctionComponent<AuthLayoutProps> = (props: AuthLayoutProps) => (
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
