import React, { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import useDeleteTool from '@holi/core/hooks/spaces/useDeleteTool'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceCollaborationTool } from '@holi/core/screens/spaces/types'
import digitalTools from '@holi/core/static/digitalTools'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, Edit2, LinkM, ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface DigitalToolProps {
  tool: SpaceCollaborationTool
  isAdmin: boolean | undefined
  spaceIdOrName: string
  onShareButtonPress: (url: string) => void
  onEditButtonPress: (toolId: string) => void
  style?: StyleProp<ViewStyle>
}

const DigitalTool = ({
  tool,
  isAdmin,
  spaceIdOrName,
  onShareButtonPress,
  onEditButtonPress,
  style,
}: DigitalToolProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [detailModalShown, setDetailModalShown] = useState(false)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const deleteToolSuccesMsg = t('spaces.digitalTool.delete.success')
  const [isLoadingDeleteTool, deleteTool] = useDeleteTool({
    id: tool.id,
    spaceIdOrName: spaceIdOrName,
    successMsg: deleteToolSuccesMsg,
  })

  const defaultTool = digitalTools.filter((t) => tool.url.toLowerCase().includes(t.slug))[0]
  const imageSource = defaultTool?.img
  const toolName = defaultTool?.name

  return (
    <View style={[styles.toolContainer, style]}>
      <MoreOptionItem
        label={''}
        onPress={() => {
          setDetailModalShown(true)
        }}
        testID={'btn-show-tool-details'}
        transparent
        style={styles.showDetailsTrigger}
      />
      <View style={styles.imageContainer} testID="tool-icon">
        {tool.thumbnail ? (
          <HoliImage
            source={{ uri: tool.thumbnail }}
            blurhash={tool.thumbnailBlurhash}
            label={tool.domain}
            style={styles.thumbnail}
          />
        ) : imageSource ? (
          <View style={styles.iconContainer}>
            <HoliLocalImage imageSource={imageSource} width={40} height={40} label={toolName} />
          </View>
        ) : (
          <HoliIcon icon={LinkM} size={40} color={colors.brandColorB30} />
        )}
      </View>
      <View style={styles.infoContainer}>
        <HoliText size="extrasmall" style={styles.toolName}>
          {toolName || tool.domain}
        </HoliText>
        <HoliText style={styles.toolTitle} testID="tool-title">
          {tool.title}
        </HoliText>
      </View>
      <View style={styles.buttonContainer}>
        <View>
          <HoliButton
            label={t('spaces.digitalTool.open.button.label')}
            transparent
            onPress={() => onShareButtonPress(tool.url)}
          >
            <HoliIcon icon={ShareBox} size={15} />
          </HoliButton>
        </View>
        <View>
          {isAdmin && (
            <View style={{ paddingTop: 10 }}>
              <HoliActionDrawer.Drawer label={t('spaces.digitalTool.preview.more')} testID="digital-toolkit-btn">
                <HoliActionDrawer.Action
                  icon={Edit2}
                  title={t('global.edit')}
                  testID="tool-edit-btn"
                  handleAction={() => onEditButtonPress(tool.id)}
                />
                <HoliActionDrawer.Action
                  isLoading={isLoadingDeleteTool}
                  icon={Delete}
                  title={t('spaces.digitalTool.delete.label')}
                  variant="danger"
                  testID="tool-delete-btn"
                  showConfirmation
                >
                  <HoliActionDrawer.Confirmation
                    title={t('spaces.digitalTool.delete.confirmation.title')}
                    description={t('spaces.digitalTool.delete.confirmation.description')}
                    testID="tool-delete"
                    handleConfirmation={deleteTool}
                    buttonType="warning"
                    hasDismissBtn
                    requireLogin
                  />
                </HoliActionDrawer.Action>
              </HoliActionDrawer.Drawer>
            </View>
          )}
        </View>
      </View>
      <HoliModal
        shown={detailModalShown}
        onDismiss={() => setDetailModalShown(false)}
        testID="tool-details-modal"
        label={t('spaces.digitalTool.showDetails')}
      >
        <View style={[styles.modalContent]}>
          <View style={styles.modalHeader}>
            {tool.thumbnail ? (
              <HoliImage
                source={{ uri: tool.thumbnail }}
                blurhash={tool.thumbnailBlurhash}
                label={tool.domain}
                style={styles.thumbnailLarge}
              />
            ) : imageSource ? (
              <View style={styles.iconContainer}>
                <HoliLocalImage imageSource={imageSource} width={52} height={52} label={tool.title} />
              </View>
            ) : (
              <HoliIcon icon={LinkM} size={40} color={colors.brandColorB30} />
            )}
            <HoliButton
              onPress={() => {
                navigate(`/spaces/${spaceIdOrName}/linkhub/tools/${tool?.id}/edit`)
              }}
              inline
              label={t('global.edit')}
              type="secondary"
              variant="small"
              testID="btn-to-edit-tool"
            >
              <HoliText>{t('global.edit')}</HoliText>
              <HoliIcon icon={Edit2} />
            </HoliButton>
          </View>
          <HoliHeading level="2" size="l">
            {defaultTool ? toolName : tool?.title}
          </HoliHeading>
          <HoliGap size="xs" />
          {tool.description && (
            <HoliText size="small" style={styles.modalToolDescription} testID="tool-desc">
              {tool.description}
            </HoliText>
          )}
          <HoliLink testID="tool-url-link" label={tool.url} href={tool.url} external>
            <View style={styles.modalToolLink}>
              <HoliText size="small" numberOfLines={1} style={{ width: '90%' }}>
                <Trans
                  t={t}
                  i18nKey="spaces.digitalTool.details.open"
                  values={{ url: tool.url }}
                  shouldUnescape={true}
                />
              </HoliText>
              <HoliIcon icon={ShareBox} size={20} color={colors.foreground20} style={{ flexShrink: 0 }} />
            </View>
          </HoliLink>
        </View>
      </HoliModal>
    </View>
  )
}

export default DigitalTool

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    toolContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background10,
      padding: 16,
      marginBottom: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    toolName: {
      color: theme.colors.foreground20,
    },
    toolTitle: {
      color: theme.colors.foreground30,
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    thumbnail: {
      width: 40,
      height: 40,
      borderRadius: 8,
    },
    thumbnailLarge: {
      width: 52,
      height: 52,
      borderRadius: 8,
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
      borderBottomColor: theme.colors.background30,
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
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 56,
    },
    modalHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 32,
    },
    modalToolDescription: {
      color: theme.colors.foreground20,
    },
    modalToolLink: {
      backgroundColor: theme.colors.background20,
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
