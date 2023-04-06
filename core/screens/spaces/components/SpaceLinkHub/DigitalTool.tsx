import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import useRouting from '@holi/core/navigation/hooks/useRouting/useRouting'
import DeleteCollaborationToolButton from '@holi/core/screens/spaces/components/DeleteCollaborationToolButton'
import { SpaceCollaborationTool } from '@holi/core/screens/spaces/types'
import digitalTools from '@holi/core/static/digitalTools'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
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
  const { navigate } = useRouting()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const defaultTool = digitalTools.filter((t) => tool.url.toLowerCase().includes(t.slug))[0]
  const imageSource = defaultTool?.img
  const toolName = defaultTool?.name

  return (
    <View style={styles.toolContainer}>
      <MoreOptionItem
        label={''}
        onPress={() => {
          setShowDetailModal(true)
        }}
        testID={'btn-show-digital-tool-details'}
        transparent
        style={styles.showDetailsTrigger}
      />
      <View style={styles.imageContainer}>
        {tool.thumbnail ? (
          <HoliImage source={{ uri: tool.thumbnail }} label={tool.domain} />
        ) : imageSource ? (
          <View style={styles.iconContainer}>
            <HoliLocalImage imageSource={imageSource} width={40} height={40} label={toolName} />
          </View>
        ) : (
          <HoliIcon icon={'link-m'} size={40} style={{ color: colors.brandColorB30 }} />
        )}
      </View>
      <View style={styles.infoContainer}>
        <HoliText size="extrasmall" style={styles.toolName}>
          {toolName || tool.domain}
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
            <View style={{ paddingTop: 10 }}>
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
            </View>
          )}
        </View>
      </View>
      <HoliModal
        show={showDetailModal}
        onDismiss={() => setShowDetailModal(false)}
        testID="show-tool-details-modal"
        label={t('spaces.digitalTool.showDetails')}
      >
        <View style={[styles.modalContent]}>
          <View style={styles.modalHeader}>
            {imageSource ? (
              <View style={styles.iconContainer}>
                <HoliLocalImage imageSource={imageSource} width={52} height={52} label={tool.title} />
              </View>
            ) : (
              <HoliIcon icon={'link-m'} size={40} style={{ color: colors.brandColorB30 }} />
            )}
            <HoliButton
              onPress={() => {
                navigate(`/spaces/${spaceId}/tools/${tool?.id}/edit`)
              }}
              inline
              label={t('global.edit')}
              type="secondary"
              variant="small"
              testID="btn-to-edit-tool"
            >
              <HoliText>{t('global.edit')}</HoliText>
              <HoliIcon icon="edit-2" size={24} />
            </HoliButton>
          </View>
          <HoliHeading level="1" style={styles.modalToolName}>
            {defaultTool ? toolName : tool?.title}
          </HoliHeading>
          {tool.description && (
            <HoliText size="small" style={styles.modalToolDescription}>
              {tool.description}
            </HoliText>
          )}
          <HoliLink label={tool.url} href={tool.url} external>
            <View style={styles.modalToolLink}>
              <HoliText size="small" numberOfLines={1} style={{ width: '90%' }}>
                <Trans
                  t={t}
                  i18nKey="spaces.digitalTool.details.open"
                  values={{ url: tool.url }}
                  shouldUnescape={true}
                />
              </HoliText>
              <HoliIcon icon="share-box" size={20} style={{ color: colors.foreground20, flexShrink: 0 }} />
            </View>
          </HoliLink>
        </View>
      </HoliModal>
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
    display: 'flex',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
  },
  infoContainer: {
    flex: 4,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'space-between',
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
  showDetailsTrigger: {
    width: '90%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  modalToolName: {
    marginBottom: 8,
  },
  modalToolDescription: {
    color: colors.foreground20,
  },
  modalToolLink: {
    backgroundColor: colors.background20,
    padding: 12,
    marginTop: 20,
    borderRadius: 4,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
