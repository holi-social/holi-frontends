import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View, useWindowDimensions } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import DigitalTool from '@holi/core/screens/spaces/components/SpaceLinkHub/DigitalTool'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { CollaborationType, SpaceCollaborationTool, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

interface AllToolsProps {
  spaceIdOrName: string | undefined
}

const TOOL_COLLECTIONS = [
  { id: '0', name: CollaborationType.COLLABORATION },
  { id: '1', name: CollaborationType.COMMUNICATION },
]

//TODO: Implement Screen
const AllTools: React.FC<AllToolsProps> = ({ spaceIdOrName }: AllToolsProps) => {
  const { t } = useTranslation()
  const [toolList, setToolList] = useState<SpaceCollaborationTool[] | undefined>()
  const [collaborationTools, setCollaborationTools] = useState<SpaceCollaborationTool[] | undefined>()
  const [communicationTools, setCommunicationTools] = useState<SpaceCollaborationTool[] | undefined>()

  const { navigate } = useRouting()

  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions()
  let imageWidth = 271
  let imageHeight = 342
  const largerThanAnyCellphone =
    deviceWidth > parseInt(vars.largestMobileWidth, 10) && deviceHeight > parseInt(vars.largestMobileHeight, 10)
  if (largerThanAnyCellphone) {
    imageWidth = imageWidth * 1.2
    imageHeight = imageHeight * 1.2
  }

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
      const tools = space.collaborationTools
      const collaborationTools = tools
        ? tools.filter((tool) => tool.collectionType === CollaborationType.COLLABORATION)
        : []

      const communicationTools = tools
        ? tools.filter((tool) => tool.collectionType === CollaborationType.COMMUNICATION)
        : []
      setCollaborationTools(collaborationTools)
      setCommunicationTools(communicationTools)

      setToolList(tools)
    }
  }, [space])

  console.log('collaborationTools -->', collaborationTools)
  console.log('communication tools -->', communicationTools)

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
          height={imageHeight}
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

  const ToolWidget = ({ widgetTitle }: { widgetTitle: string }) => {
    return (
      <CollaboratorAreaCard
        icon="tools"
        title={widgetTitle}
        onPress={() => {
          console.log('onPress')
        }}
      >
        {(toolList &&
          toolList.length > 0 &&
          toolList.map((tool) => {
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
          })) || <NoTools />}
      </CollaboratorAreaCard>
    )
  }

  return (
    <View style={{ margin: 24 }}>
      {TOOL_COLLECTIONS.map((collectionType) => {
        return <ToolWidget key={collectionType.id} widgetTitle={collectionType.name} />
      })}
    </View>
  )
}

export default AllTools

const styles = StyleSheet.create({
  noToolsContainer: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.foreground30,
    backgroundColor: colors.background10,
    margin: 24,
    padding: 24,
    alignItems: 'center',
  },
  illustration: {
    marginTop: 32,
  },
  noToolsTitle: {},
  noToolsDescription: { textAlign: 'center' },
  widgetContainer: {},
})
