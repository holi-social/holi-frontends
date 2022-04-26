import React, { useContext } from 'react'
import { StyleSheet, Text } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import AppTiles from '@holi/core/spaces/components/AppTiles'
import SpaceLayout from '@holi/core/spaces/spaceLayout'

const PrivateSpaceScreen: React.VoidFunctionComponent = () => {
  const { isAuthenticated, session } = useContext(AuthContext)

  return (
    <SpaceLayout>
      {isAuthenticated || session ? (
        <Text style={styles.header} testID="private-space-header-greeting">
          Hello {session?.identity.traits.email}
        </Text>
      ) : (
        <Text style={styles.header} testID="private-space-header-greeting">
          Hello Anna
        </Text>
      )}
      <Text style={styles.subHeader} testID="private-space-header-sub">
        Nice to see you here!
      </Text>
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
