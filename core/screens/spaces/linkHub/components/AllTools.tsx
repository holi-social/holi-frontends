import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import NoTools from '@holi/core/screens/spaces/linkHub/components/NoTools'
import ToolWidget from '@holi/core/screens/spaces/linkHub/components/ToolWidget'
import { type CollaborationTool, CollectionType, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

type AllToolsProps = {
  spaceIdOrName?: string
}

type CategorizedToolsListProps = {
  [CollaborationType: string]: CollaborationTool[]
}

const AllTools = ({ spaceIdOrName }: AllToolsProps) => {
  const { t } = useTranslation()
  const [categorizedToolsList, setCategorizedToolsList] = useState<CategorizedToolsListProps | undefined>()
  const { navigate } = useRouting()

  const { space } = useSpace(spaceIdOrName)

  const isAdmin = !!space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)

  useEffect(() => {
    if (space) {
      const allTools = space.collaborationTools

      if (allTools && allTools.length > 0) {
        const toolsList = allTools.reduce((acc, curr) => {
          acc[curr.collectionType] = acc[curr.collectionType] || []
          acc[curr.collectionType].push(curr)
          return acc
        }, {} as CategorizedToolsListProps)
        setCategorizedToolsList(toolsList)
      }
    }
  }, [space])

  if (space && !isMember) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  if (!spaceIdOrName || !space) return null

  return (
    <View style={styles.container}>
      {(categorizedToolsList &&
        (Object.keys(CollectionType) as Array<keyof typeof CollectionType>).map((collaborationType) => {
          const tools = categorizedToolsList[collaborationType]
          if (tools && tools.length > 0) {
            return (
              <ToolWidget
                key={collaborationType}
                widgetTitle={t('spaces.toolKit.linkhub.collection.' + collaborationType)}
                toolsList={tools}
                spaceIdOrName={spaceIdOrName}
                spaceName={space.name}
                isAdmin={isAdmin}
              />
            )
          }
        })) || <NoTools spaceIdOrName={spaceIdOrName} />}
    </View>
  )
}

export default AllTools

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
})
