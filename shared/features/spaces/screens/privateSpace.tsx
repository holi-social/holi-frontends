import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'
import SpaceLayout from 'shared/features/spaces/spaceLayout'
import AppTiles from 'shared/features/spaces/components/AppTiles'
import { AuthContext } from 'shared/features/authentication/AuthProvider'

const PrivateSpaceScreen: React.VoidFunctionComponent = () => {
  const { isAuthenticated, session, sessionToken } = useContext(AuthContext)

  useEffect(() => {
    if (!isAuthenticated || !session) {
      console.log('not logged in')
      //navigation.navigate('/login')
    }
  }, [isAuthenticated, sessionToken])

  if (!isAuthenticated || !session) {
    return null
  }

  // Get the name, or if it does not exist in the traits, use the
  // identity's ID
  const { name: { email = session.identity.traits.email } = {} } = session.identity.traits

  return (
    <SpaceLayout>
      <Text style={styles.header}>Hello {email}</Text>
      <Text style={styles.subHeader}>Nice to see you here!</Text>
      <AppTiles style={{ marginTop: 40 }} />
    </SpaceLayout>
  )
}

export { PrivateSpaceScreen }

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
  },
  subHeader: {
    textAlign: 'center',
    marginTop: 10,
  },
})
