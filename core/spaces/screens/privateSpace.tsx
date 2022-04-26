import React, { useContext } from 'react'
import { StyleSheet, Text } from 'react-native'
import SpaceLayout from '@holi/core/spaces/spaceLayout'
import AppTiles from '@holi/core/spaces/components/AppTiles'
import { AuthContext } from '@holi/core/auth/AuthProvider'

const PrivateSpaceScreen: React.VoidFunctionComponent = () => {
  const { isAuthenticated, username } = useContext(AuthContext)

  return (
    <SpaceLayout>
      {isAuthenticated ? (
        <Text style={styles.header}>Hello {username}</Text>
      ) : (
        <Text style={styles.header}>Hello Anna</Text>
      )}
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
