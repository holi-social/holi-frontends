import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import DigitalTool from '@holi/core/screens/spaces/linkHub/components/DigitalTool'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Add, LinkM } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface LinkHubWidgetProps {
  space: Space
}

const INITIAL_NUMBER_OF_ITEMS = 3

const LinkHubWidget: React.VFC<LinkHubWidgetProps> = ({ space }) => {
  const { useParam } = createParam<SpaceDetailsParams>()
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { collaborationTools = [] } = space

  const handleShareButtonPress = (url: string) => {
    Linking.openURL(url)
  }

  const navigateToLinkHubPage = () => {
    navigate(`/spaces/${space.name}/linkhub`)
  }

  const navigateToEditToolPage = (toolIdOrName: string) => {
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/${toolIdOrName}/edit`)
  }

  const navigateToAddToolPage = () => {
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/create`)
  }

  const NoToolsAvailable = () => {
    return (
      <View style={styles.noToolsDescriptionContainer}>
        <HoliText size="small" style={styles.descriptionText}>
          {t('spaces.digitalToolKit.noData.discription')}
        </HoliText>
        <HoliButton label={t('spaces.digitalToolKit.noData.instruction')} transparent onPress={navigateToAddToolPage}>
          <HoliText size="small" style={styles.instruction}>
            {t('spaces.digitalToolKit.noData.instruction')}
          </HoliText>
        </HoliButton>
      </View>
    )
  }

  return (
    <CollaboratorAreaCard
      headerLeftIcon={LinkM}
      headerRightIcon={Add}
      headerRightButtonLabel={t('spaces.digitalToolKit.add.button.label')}
      title={t('spaces.digitalToolKit.title')}
      onPressHeaderLeft={navigateToLinkHubPage}
      onPressHeaderRight={navigateToAddToolPage}
      testID="space-tools-card"
    >
      <View style={styles.toolKitContainer}>
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
              />
            ))) || <NoToolsAvailable />}
        {collaborationTools.length > INITIAL_NUMBER_OF_ITEMS && (
          <View style={styles.seeAllButtonContainer}>
            <HoliButton
              label={t('spaces.digitalToolKit.seeAll.button.label')}
              style={styles.seeAllButton}
              onPress={navigateToLinkHubPage}
            >
              <HoliText>{t('spaces.digitalToolKit.seeAll.button.label')}</HoliText>
            </HoliButton>
          </View>
        )}
      </View>
    </CollaboratorAreaCard>
  )
}

export default LinkHubWidget

const styles = StyleSheet.create({
  toolKitContainer: {
    flex: 1,
    width: '100%',
    padding: 8,
    paddingBottom: 16,
  },
  seeAllButtonContainer: {
    alignSelf: 'center',
  },
  seeAllButton: {
    backgroundColor: colors.background10,
  },
  noToolsDescriptionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  instruction: {
    marginTop: 12,
    alignSelf: 'center',
    color: colors.foreground30,
  },
  descriptionText: {
    textAlign: 'center',
    color: colors.foreground20,
  },
})
