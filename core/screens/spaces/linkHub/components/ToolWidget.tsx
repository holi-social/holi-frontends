import React from 'react'
import { Linking, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import DigitalTool from '@holi/core/screens/spaces/linkHub/components/DigitalTool'
import type { CollaborationTool } from '@holi/api/graphql/graphql-codegen'

type ToolWidgetProps = {
  spaceIdOrName: string
  spaceName: string
  widgetTitle: string
  toolsList: CollaborationTool[]
  isAdmin: boolean
}

const ToolWidget = ({ widgetTitle, toolsList, spaceIdOrName, spaceName, isAdmin }: ToolWidgetProps) => {
  const { navigate } = useRouting()

  const handleShareButtonPress = (url: string) => {
    Linking.openURL(url)
  }

  const navigateToEditToolPage = (toolIdOrName: string) => {
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/${toolIdOrName}/edit`)
  }

  return (
    <CollaboratorAreaCard title={widgetTitle} style={styles.container} testID="space-tools-card">
      <View style={{ paddingHorizontal: 7.5 }}>
        {toolsList.map((tool) => {
          return (
            <View key={tool.id}>
              <DigitalTool
                tool={tool}
                isAdmin={isAdmin}
                spaceIdOrName={spaceName || ''}
                onShareButtonPress={handleShareButtonPress}
                onEditButtonPress={navigateToEditToolPage}
              />
            </View>
          )
        })}
      </View>
    </CollaboratorAreaCard>
  )
}

export default ToolWidget

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
})
