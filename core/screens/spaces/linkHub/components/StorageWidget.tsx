import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getUrlForSpaceStorage } from '@holi/core/screens/spaces/helpers/urls'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Space } from '@holi/core/screens/spaces/types'
import { FolderOpen } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface StorageWidgetProps {
  space: Space
}

const StorageWidget: React.VFC<StorageWidgetProps> = ({ space }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const navigateToStorageScreen = useCallback(() => {
    if (Platform.OS === 'web') {
      Linking.openURL(getUrlForSpaceStorage(space))
    } else {
      navigate(`/spaces/${space.name}/storage`)
    }
  }, [navigate, space])

  return (
    <CollaboratorAreaCard
      headerLeftIcon={FolderOpen}
      title={t('spaces.storage.widget.title')}
      onPressHeaderLeft={navigateToStorageScreen}
    >
      <HoliButton
        style={styles.container}
        transparent
        label={t('spaces.storage.widget.description')}
        onPress={navigateToStorageScreen}
      >
        <HoliText size="small" style={styles.descriptionText}>
          {t('spaces.storage.widget.description')}
        </HoliText>
        <HoliText size="small" style={styles.instruction}>
          {t('spaces.storage.widget.instruction')}
        </HoliText>
      </HoliButton>
    </CollaboratorAreaCard>
  )
}

export default StorageWidget

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
    paddingBottom: 16,
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
