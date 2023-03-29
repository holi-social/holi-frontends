import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

const StorageWidget: React.VFC = () => {
  const { useParam } = createParam<SpaceDetailsParams>()
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)

  const navigateToStorageScreen = () => {
    navigate(`/spaces/${spaceIdOrName}/storage`)
  }

  return (
    <CollaboratorAreaCard
      headerLeftIcon="link-m"
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
