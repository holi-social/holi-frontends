import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from '@holi/ui/components/safe-area'

type AuthLayoutProps = {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild> | string
}

const AuthLayout: React.FunctionComponent<AuthLayoutProps> = (props: AuthLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>{props.children}</View>
    </SafeAreaView>
  )
}

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
  scrollView: {},
})
