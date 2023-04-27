import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import DigitalTool from '@holi/core/screens/spaces/linkHub/components/DigitalTool'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { CollaborationType, SpaceCollaborationTool, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface AllToolsProps {
  spaceIdOrName: string | undefined
}

type CategorizedToolsListProps = {
  [CollaborationType: string]: SpaceCollaborationTool[]
}

type ToolWidgetProps = {
  widgetTitle: string
  toolsList: SpaceCollaborationTool[]
}

const AllTools: React.FC<AllToolsProps> = ({ spaceIdOrName }: AllToolsProps) => {
  const { t } = useTranslation()
  const [categorizedToolsList, setCategorizedToolsList] = useState<CategorizedToolsListProps | undefined>()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
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
        const toolsList = allTools.reduce((acc, curr) => {
          acc[curr.collectionType] = acc[curr.collectionType] || []
          acc[curr.collectionType].push(curr)
          return acc
        }, {})
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
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/${toolIdOrName}/edit`)
  }

  const navigateToAddToolPage = () => {
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/create`)
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
        <HoliButton
          label={t('allTools.drawer.headline')}
          inline
          testID="space-resources-add-button"
          onPress={navigateToAddToolPage}
          style={styles.linkToolButton}
        >
          <HoliText>{t('spaces.toolKit.allTools.noData.link.button.label')}</HoliText>
        </HoliButton>
      </View>
    )
  }

  const ToolWidget = ({ widgetTitle, toolsList }: ToolWidgetProps) => {
    return (
      <CollaboratorAreaCard title={widgetTitle} style={styles.widgetContainer} testID="space-tools-card">
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
              />
            )
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
  noToolsDescription: { textAlign: 'center', marginTop: 8, color: colors.foreground30 },
  widgetContainer: { marginBottom: 24 },
  linkToolButton: {
    marginTop: 24,
  },
})
