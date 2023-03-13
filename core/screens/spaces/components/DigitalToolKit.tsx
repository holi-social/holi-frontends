import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import { Space, SpaceLink, SpaceLinkVisibility } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface DigitalToolKitProps {
  space: Space
}

const INITIAL_NUMBER_OF_ITEMS = 3

const filterPrivateLinks = (link: SpaceLink) => link.visibility === SpaceLinkVisibility.PRIVATE

const DigitalToolKit: React.VFC<DigitalToolKitProps> = ({ space }) => {
  const [displayToolList, setDisplayToolList] = useState<Array<SpaceLink>>([])
  const { t } = useTranslation()

  const { links = [] } = space

  useEffect(() => {
    const privateLinks = links?.filter(filterPrivateLinks) || []
    const subArray = privateLinks.slice(0, INITIAL_NUMBER_OF_ITEMS)
    setDisplayToolList(subArray)
  }, [links])

  const handleSeeAllButtonPress = () => {
    setDisplayToolList(links.filter(filterPrivateLinks))
  }

  const handleShareButtonPress = (url: string) => {
    Linking.openURL(url)
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

  const DigitalTool = ({ tool }: { tool: SpaceLink }) => {
    return (
      <View style={styles.toolContainer}>
        <View style={styles.imageContainer}>
          {tool.thumbnail && <HoliImage source={{ uri: tool.thumbnail }} label={t(`spaces.link.${tool.type}`)} />}
        </View>
        <View style={styles.infoContainer}>
          <HoliText size="extrasmall" style={styles.toolName}>
            {t(`spaces.link.${tool.type}`)}
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
    <CollaboratorAreaCard icon="tools" title={t('spaces.digitalToolKit.title')}>
      <View style={styles.toolKitContainer}>
        {(displayToolList.length > 0 && displayToolList.map((item) => <DigitalTool key={item.id} tool={item} />)) || (
          <NoToolsAvailable />
        )}
        {displayToolList.length < links.filter(filterPrivateLinks).length && (
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
