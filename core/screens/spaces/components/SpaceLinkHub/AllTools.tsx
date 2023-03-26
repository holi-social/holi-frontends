import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import DigitalTool from '@holi/core/screens/spaces/components/SpaceLinkHub/DigitalTool'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { CollaborationType, SpaceCollaborationTool, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface AllToolsProps {
  spaceIdOrName: string | undefined
}

const TOOL_COLLECTIONS = [
  { id: '0', type: CollaborationType.COLLABORATION, name: 'Collaboration' },
  { id: '1', type: CollaborationType.COMMUNICATION, name: 'Communication' },
]

type CategorizedToolsListProps = {
  [CollaborationType: string]: {
    tools: SpaceCollaborationTool[]
  }
}

type ToolWidgetProps = {
  widgetTitle: string
  toolsList: SpaceCollaborationTool[]
}

const AllTools: React.FC<AllToolsProps> = ({ spaceIdOrName }: AllToolsProps) => {
  const { t } = useTranslation()
  const [categorizedToolsList, setCategorizedToolsList] = useState<CategorizedToolsListProps | undefined>()
  const { navigate } = useRouting()
  const imageWidth = 251

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  useEffect(() => {
    if (space) {
      const allTools = space.collaborationTools

      if (allTools && allTools.length > 0) {
        const collaborationTools = allTools.filter((tool) => tool.collectionType === CollaborationType.COLLABORATION)
        const communicationTools = allTools.filter((tool) => tool.collectionType === CollaborationType.COMMUNICATION)
        const toolsList = {
          [CollaborationType.COLLABORATION]: { tools: collaborationTools },
          [CollaborationType.COMMUNICATION]: { tools: communicationTools },
        }
        setCategorizedToolsList(toolsList)
      }
    }
  }, [space])

  if (errorSpace) {
    logError(errorSpace, `[Alltools.tsx] ${errorSpace.message}`)
  }

  if (!loadingSpace && !isAdmin) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  const handleShareButtonPress = (url: string) => {
    Linking.openURL(url)
  }

  const navigateToEditToolPage = (toolIdOrName: string) => {
    navigate(`/spaces/${spaceIdOrName}/tools/${toolIdOrName}/edit`)
  }

  const NoTools = () => {
    return (
      <View style={styles.noToolsContainer}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_space_digital_tools.svg')}
          width={imageWidth}
          height={imageWidth * 0.6}
          label={''}
          isSvg={true}
          resizeMode="stretch"
          style={styles.illustration}
        />
        <HoliText size="small">{t('spaces.toolKit.allTools.noData.title')}</HoliText>
        <HoliText size="large" style={styles.noToolsDescription}>
          {t('spaces.toolKit.allTools.noData.description')}
        </HoliText>
      </View>
    )
  }

  const ToolWidget = ({ widgetTitle, toolsList }: ToolWidgetProps) => {
    return (
      <CollaboratorAreaCard title={widgetTitle} style={styles.widgetContainer}>
        <View style={{ paddingHorizontal: 7.5 }}>
          {toolsList.map((tool) => {
            return (
              <View key={tool.id}>
                <DigitalTool
                  tool={tool}
                  isAdmin={isAdmin}
                  spaceId={space?.id || ''}
                  onShareButtonPress={(url) => handleShareButtonPress(url)}
                  onEditButtonPress={(toolId) => navigateToEditToolPage(toolId)}
                />
              </View>
            )
          })}
        </View>
      </CollaboratorAreaCard>
    )
  }

  return (
    <View style={styles.container}>
      {(categorizedToolsList &&
        TOOL_COLLECTIONS.map((collectionType) => {
          const tools = categorizedToolsList ? categorizedToolsList[collectionType.type].tools : []
          if (tools && tools.length > 0) {
            return <ToolWidget key={collectionType.id} widgetTitle={collectionType.name} toolsList={tools} />
          }
        })) || <NoTools />}
    </View>
  )
}

export default AllTools

const styles = StyleSheet.create({
  container: {
    margin: 24,
  },
  noToolsContainer: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    margin: 24,
    padding: 24,
    alignItems: 'center',
  },
  illustration: {
    marginTop: 32,
    marginBottom: 24,
  },
  noToolsTitle: { color: colors.foreground30 },
  noToolsDescription: { textAlign: 'center', marginTop: 8, color: colors.foreground30 },
  widgetContainer: { marginBottom: 24 },
})
