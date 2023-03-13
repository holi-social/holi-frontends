import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type Tool = {
  id: string
  name: string
  title: string
  url: string
  thumbnail?: string
}
const toolList: Tool[] = [
  { id: '0', name: 'Miro', title: 'Ideas whiteboard', url: 'https://miro.com/', thumbnail: undefined },
  { id: '1', name: 'Rocket Chat', title: 'Team chat', url: 'https://de.rocket.chat/', thumbnail: undefined },
  { id: '2', name: 'Jitsi Meet', title: 'Monthly meetup room', url: 'https://meet.jit.si/', thumbnail: undefined },
  { id: '3', name: 'Slack', title: 'Team chat', url: 'https://slack.com/intl/de-de', thumbnail: undefined },
]

interface DigitalToolKitProps {
  spaceIdOrName: string | undefined
}

const DigitalToolKit: React.FC<DigitalToolKitProps> = ({ spaceIdOrName }: DigitalToolKitProps) => {
  const [displayToolList, setDisplayToolList] = useState<Array<Tool>>([])
  const { t } = useTranslation()
  const { navigate } = useRouting()

  useEffect(() => {
    const subArray = toolList.slice(0, 3)
    setDisplayToolList(subArray)
  }, [])

  const handleSeeAllButtonPress = () => {
    setDisplayToolList(toolList)
  }

  const handleShareButtonPress = (url: string) => {
    Linking.openURL(url)
  }

  const navigateToToolkitPage = () => {
    navigate(`/spaces/${spaceIdOrName}/toolKit`)
  }

  const NoToolsAvailable = () => {
    return (
      <View style={styles.noToolsDescriptionContainer}>
        <HoliText size="small">{t('spaces.digitalToolKit.noData.discription.title')}</HoliText>
        <HoliText size="extrasmall" style={styles.descriptionText}>
          {t('spaces.digitalToolKit.noData.discription')}
        </HoliText>
      </View>
    )
  }

  const DigitalTool = ({ tool }: { tool: Tool }) => {
    return (
      <View style={styles.toolContainer}>
        <View style={styles.imageContainer}>
          {tool.thumbnail && <HoliImage source={{ uri: tool.thumbnail }} label={tool.name} />}
        </View>
        <View style={styles.infoContainer}>
          <HoliText size="extrasmall" style={styles.toolName}>
            {tool.name}
          </HoliText>
          <HoliText style={styles.toolTitle}>{tool.title}</HoliText>
        </View>
        <View style={styles.shareButtonContainer}>
          <HoliButton
            label={t('spaces.digitalTool.open.button.label')}
            transparent
            onPress={() => handleShareButtonPress(tool.url)}
          >
            <HoliIcon icon={'share-box'} size={15} />
          </HoliButton>
        </View>
      </View>
    )
  }

  return (
    <CollaboratorAreaCard icon="tools" title={t('spaces.digitalToolKit.title')} onPress={navigateToToolkitPage}>
      <View style={styles.toolKitContainer}>
        {(displayToolList.length > 0 &&
          displayToolList.map((item) => {
            return <DigitalTool key={item.id} tool={item} />
          })) || <NoToolsAvailable />}
        {toolList.length > 3 && displayToolList.length !== toolList.length && (
          <View style={styles.seeAllButtonContainer}>
            <HoliButton
              label={t('spaces.digitalToolKit.seeAll.button.label')}
              style={styles.seeAllButton}
              onPress={handleSeeAllButtonPress}
            >
              <HoliText>{t('spaces.digitalToolKit.seeAll.button.label')}</HoliText>
            </HoliButton>
          </View>
        )}
      </View>
    </CollaboratorAreaCard>
  )
}

export default DigitalToolKit

const styles = StyleSheet.create({
  toolKitContainer: {
    flex: 1,
    width: '100%',
    padding: 8,
    paddingBottom: 16,
  },
  toolContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.background10,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  toolName: {
    color: colors.foreground20,
  },
  toolTitle: {
    color: colors.foreground30,
  },
  imageContainer: {
    width: 32,
    aspectRatio: 1,
    backgroundColor: colors.background20,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 4,
    flexDirection: 'column',
    marginLeft: 12,
  },
  shareButtonContainer: {
    justifyContent: 'center',
  },
  seeAllButtonContainer: {
    alignSelf: 'center',
  },
  seeAllButton: {
    backgroundColor: colors.background10,
  },
  noToolsDescriptionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 70,
  },
  descriptionText: {
    color: colors.foreground20,
  },
})
