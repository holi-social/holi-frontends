import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import DeleteCollaborationToolButton from '@holi/core/screens/spaces/components/DeleteCollaborationToolButton'
import { SpaceCollaborationTool } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

interface DigitalToolProps {
  tool: SpaceCollaborationTool
  isAdmin: boolean | undefined
  spaceId: string
  onShareButtonPress: (url: string) => void
  onEditButtonPress: (toolId: string) => void
}

const DigitalTool: React.VFC<DigitalToolProps> = ({
  tool,
  isAdmin,
  spaceId,
  onShareButtonPress,
  onEditButtonPress,
}) => {
  const { t } = useTranslation()
  const { visible, show, hide } = useModalState()

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
      <View style={styles.buttonContainer}>
        <View>
          <HoliButton
            label={t('spaces.digitalTool.open.button.label')}
            transparent
            onPress={() => onShareButtonPress(tool.url)}
          >
            <HoliIcon icon={'share-box'} size={15} />
          </HoliButton>
        </View>
        <View>
          {isAdmin && (
            <MoreOptionsButtonWithModal
              label={t('spaces.digitalTool.preview.more')}
              showOptions={visible}
              onModalDismiss={hide}
              testID="digital-toolkit-btn"
              onPress={() => {
                visible && hide()
                show()
              }}
            >
              <>
                <HoliHeading level="2" size="small" style={styles.toolContextHeader}>
                  {tool.title}
                </HoliHeading>
                <MoreOptionItem
                  icon="edit-2"
                  label={t('global.edit')}
                  onPress={() => {
                    visible && hide()
                    onEditButtonPress(tool.id)
                  }}
                  contentStyle={styles.buttonWithIcon}
                />
                <DeleteCollaborationToolButton
                  toolId={tool.id || ''}
                  spaceIdOrName={spaceId}
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
    </View>
  )
}

export default DigitalTool

const styles = StyleSheet.create({
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
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonWithIcon: {
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 18,
    marginBottom: 12,
  },
  toolContextHeader: {
    width: '100%',
    textAlign: 'center',
    marginTop: 16,
    paddingBottom: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.background30,
  },
  shareIcon: {
    marginBottom: 5,
  },
})
