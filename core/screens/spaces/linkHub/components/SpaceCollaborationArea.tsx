import React from 'react'
import { StyleSheet, View } from 'react-native'

import LinkHubWidget from '@holi/core/screens/spaces/linkHub/components/LinkHubWidget'
import StorageWidget from '@holi/core/screens/spaces/linkHub/components/StorageWidget'
import { Space } from '@holi/core/screens/spaces/types'

interface SpaceCollaborationAreaProps {
  space: Space
}

const SpaceCollaborationArea: React.FC<SpaceCollaborationAreaProps> = ({ space }) => {
  return (
    <View style={styles.collaborationAreaContainer}>
      <LinkHubWidget space={space} />
      <View style={{ marginTop: 16 }}>
        <StorageWidget space={space} />
      </View>
    </View>
  )
}

export default SpaceCollaborationArea

const styles = StyleSheet.create({
  collaborationAreaContainer: {
    marginBottom: 16,
  },
})
