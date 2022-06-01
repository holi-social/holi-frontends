import React, { useContext } from 'react'
import { StyleSheet, Text } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import AppTiles from '@holi/core/spaces/components/AppTiles'
import SpaceLayout from '@holi/core/spaces/spaceLayout'
import HoliHeading from '@holi/ui/components/HoliHeading'

const PrivateSpaceScreen: React.VoidFunctionComponent = () => {
  const { isAuthenticated, username } = useContext(AuthContext)

  return (
    <SpaceLayout>
      {isAuthenticated ? (
        <HoliHeading level={1} testID="private-space-header-greeting">
          Hello {username}
        </HoliHeading>
      ) : (
        <HoliHeading level={1} testID="private-space-header-greeting">
          Hello Anna
        </HoliHeading>
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
  subHeader: {
    textAlign: 'center',
    marginTop: 10,
  },
})
