import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import NoTools from '@holi/core/screens/spaces/linkHub/components/NoTools'
import ToolWidget from '@holi/core/screens/spaces/linkHub/components/ToolWidget'
import { CollaborationType, SpaceCollaborationTool, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type AllToolsProps = {
  spaceIdOrName?: string
}

type CategorizedToolsListProps = {
  [CollaborationType: string]: SpaceCollaborationTool[]
}

const AllTools = ({ spaceIdOrName }: AllToolsProps) => {
  const { t } = useTranslation()
  const [categorizedToolsList, setCategorizedToolsList] = useState<CategorizedToolsListProps | undefined>()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()

  const { space } = useSpace(spaceIdOrName)

  const isAdmin = !!space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

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

  return (
    <View style={[mixins.container, styles.container]}>
      {(categorizedToolsList &&
        (Object.keys(CollaborationType) as Array<keyof typeof CollaborationType>).map((collaborationType) => {
          const tools = categorizedToolsList[collaborationType]
          if (tools && tools.length > 0) {
            return (
              <ToolWidget
                key={collaborationType}
                widgetTitle={t('spaces.toolKit.linkhub.collection.' + collaborationType)}
                toolsList={tools}
                spaceIdOrName={spaceIdOrName}
                spaceName={space?.name}
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
    margin: 24,
  },
})
