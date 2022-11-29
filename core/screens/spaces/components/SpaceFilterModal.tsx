import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SpaceFilterModal: React.FC = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [showFilterModal, setShowFilterModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowFilterModal(false)
  }, [setShowFilterModal])
  const openModal = useCallback(() => {
    setShowFilterModal(true)
  }, [setShowFilterModal])

  return (
    <>
      {/* Floating filter button */}
      <HoliButton
        label={t('spaces.filter.button.label')}
        testID="btn-filter-spaces"
        inline
        style={styles.overlayButton}
        onPress={openModal}
      >
        <HoliText size="small" bold>
          {t('spaces.filter.button.text')}
        </HoliText>
        <HoliIcon icon="filter-3" size={16} color={colors.fontColorBlack} style={styles.icon} />
      </HoliButton>

      {/* Filter modal */}
      <HoliModal
        label={t('spaces.filter.heading')}
        show={showFilterModal}
        onDismiss={closeModal}
        testID="space-filter-modal"
      >
        <View style={[mixins.container]}>
          <HoliHeading level="2">{t('spaces.filter.heading')}</HoliHeading>
        </View>
      </HoliModal>
    </>
  )
}

const styles = StyleSheet.create({
  overlayButton: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: (Platform.OS === 'web' ? +vars.bottomBarHeight : 0) + 16,
    right: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginLeft: 6,
    marginBottom: 2,
  },
})

export default SpaceFilterModal
