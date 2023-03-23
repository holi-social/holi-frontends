import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import DeleteCollaborationToolButton from '@holi/core/screens/spaces/components/DeleteCollaborationToolButton'
import { Space, SpaceCollaborationTool } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

interface DigitalToolKitProps {
  space: Space
}

const INITIAL_NUMBER_OF_ITEMS = 3

const DigitalToolKit: React.VFC<DigitalToolKitProps> = ({ space }) => {
  const [showAll, setShowAll] = useState(false)
  const [selectedTool, setSelectedTool] = useState<SpaceCollaborationTool>()
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { visible, show, hide } = useModalState()
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const { collaborationTools = [] } = space

  const handleShareButtonPress = (url: string) => {
    Linking.openURL(url)
  }

  const navigateToToolkitPage = () => {
    navigate(`/spaces/${space.name}/toolKit`)
  }

  const navigateToEditToolPage = (toolIdOrName: string) => {
    navigate(`/spaces/${spaceIdOrName}/tools/${toolIdOrName}/edit`)
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

  const DigitalTool = ({ tool }: { tool: SpaceCollaborationTool }) => {
    return (
      <View style={styles.toolContainer}>
        <View style={styles.imageContainer}>
          {tool.thumbnail && <HoliImage source={{ uri: tool.thumbnail }} label={tool.domain} />}
        </View>
        <View style={styles.infoContainer}>
          <HoliText size="extrasmall" style={styles.toolName}>
            {tool.domain}
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
          {isAdmin && (
            <MoreOptionsButtonWithModal
              label={t('spaces.digitalTool.preview.more')}
              showOptions={visible}
              onModalDismiss={hide}
              testID="digital-toolkit-btn"
              onPress={() => {
                setSelectedTool(tool)
                visible && hide()
                show()
              }}
            >
              <>
                <HoliHeading level="2" size="small" style={styles.toolContextHeader}>
                  {selectedTool?.title}
                </HoliHeading>
                <MoreOptionItem
                  icon="edit-2"
                  label={t('global.edit')}
                  onPress={() => {
                    visible && hide()
                    navigateToEditToolPage(tool.id)
                  }}
                  contentStyle={styles.buttonWithIcon}
                />
                <DeleteCollaborationToolButton
                  toolId={selectedTool?.id || ''}
                  spaceIdOrName={space.id}
                  onDelete={() => {
                    hide()
                  }}
                  style={styles.buttonWithIcon}
                />
              </>
            </MoreOptionsButtonWithModal>
          )}
        </View>
      </View>
    )
  }

  return (
    <CollaboratorAreaCard icon="tools" title={t('spaces.digitalToolKit.title')} onPress={navigateToToolkitPage}>
      <View style={styles.toolKitContainer}>
        {(collaborationTools.length > 0 &&
          collaborationTools
            .slice(0, showAll ? collaborationTools.length : INITIAL_NUMBER_OF_ITEMS)
            .map((item) => <DigitalTool key={item.id} tool={item} />)) || <NoToolsAvailable />}
        {collaborationTools.length > INITIAL_NUMBER_OF_ITEMS && !showAll && (
          <View style={styles.seeAllButtonContainer}>
            <HoliButton
              label={t('spaces.digitalToolKit.seeAll.button.label')}
              style={styles.seeAllButton}
              onPress={() => setShowAll(true)}
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
  buttonWithIcon: {
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  toolContextHeader: {
    width: '100%',
    textAlign: 'center',
    paddingBottom: 10,
    marginBottom: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background30,
  },
})
