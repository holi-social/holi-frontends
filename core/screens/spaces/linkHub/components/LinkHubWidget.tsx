import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import DigitalTool from '@holi/core/screens/spaces/linkHub/components/DigitalTool'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Add, LinkM } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface LinkHubWidgetProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

const INITIAL_NUMBER_OF_ITEMS = 3

interface NoToolsAvailableProps {
  onPress: () => void
}

const NoToolsAvailable: React.FC<NoToolsAvailableProps> = ({ onPress }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <HoliButton
      label={t('spaces.global.empty.instruction')}
      transparent
      onPress={onPress}
      style={styles.noToolsDescriptionContainer}
    >
      <HoliText size="small" style={styles.descriptionText}>
        {t('spaces.digitalToolKit.noData.discription')}
      </HoliText>
      <HoliText size="small" style={styles.instruction}>
        {t('spaces.global.empty.instruction')}
      </HoliText>
    </HoliButton>
  )
}

const LinkHubWidget: React.FC<LinkHubWidgetProps> = ({ space, style }) => {
  const { useParam } = createParamHooks<SpaceDetailsParams>()
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { collaborationTools = [] } = space
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const handleShareButtonPress = useCallback((url: string) => {
    Linking.openURL(url)
  }, [])

  const navigateToLinkHubPage = useCallback(() => {
    navigate(`/spaces/${space.name}/linkhub`)
  }, [navigate, space.name])

  const navigateToEditToolPage = useCallback(
    (toolIdOrName: string) => {
      navigate(`/spaces/${spaceIdOrName}/linkhub/tools/${toolIdOrName}/edit`)
    },
    [navigate, spaceIdOrName]
  )

  const navigateToAddToolPage = useCallback(() => {
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/create`)
  }, [navigate, spaceIdOrName])

  return (
    <CollaboratorAreaCard
      headerLeftIcon={LinkM}
      headerRightIcon={Add}
      headerRightButtonLabel={t('spaces.digitalToolKit.add.button.label')}
      title={t('spaces.digitalToolKit.title')}
      onPressHeaderLeft={navigateToLinkHubPage}
      onPressHeaderRight={navigateToAddToolPage}
      testID="space-tools-card"
      style={[style, styles.toolKitContainer]}
    >
      {(collaborationTools.length > 0 &&
        collaborationTools
          .slice(0, INITIAL_NUMBER_OF_ITEMS)
          .map((item) => (
            <DigitalTool
              key={item.id}
              tool={item}
              isAdmin={isAdmin}
              spaceIdOrName={space?.name || ''}
              onShareButtonPress={(url) => handleShareButtonPress(url)}
              onEditButtonPress={(toolId) => navigateToEditToolPage(toolId)}
              style={styles.toolKitItem}
            />
          ))) || <NoToolsAvailable onPress={navigateToAddToolPage} />}
      {collaborationTools.length > INITIAL_NUMBER_OF_ITEMS && (
        <View style={styles.seeAllButtonContainer}>
          <HoliButton
            label={t('spaces.global.seeAllButton.label')}
            style={styles.seeAllButton}
            onPress={navigateToLinkHubPage}
          >
            <HoliText>{t('spaces.global.seeAllButton.label')}</HoliText>
          </HoliButton>
        </View>
      )}
    </CollaboratorAreaCard>
  )
}

export default LinkHubWidget

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    toolKitContainer: {
      paddingBottom: 16,
    },
    toolKitItem: {
      marginHorizontal: 8,
    },
    seeAllButtonContainer: {
      alignSelf: 'center',
    },
    seeAllButton: {
      backgroundColor: theme.colors.background10,
    },
    noToolsDescriptionContainer: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 8,
      marginTop: 24,
    },
    instruction: {
      marginTop: 12,
      alignSelf: 'center',
      color: theme.colors.foreground30,
    },
    descriptionText: {
      textAlign: 'center',
      color: theme.colors.foreground20,
    },
  })
