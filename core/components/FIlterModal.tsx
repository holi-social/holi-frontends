import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View, StyleSheet } from 'react-native'
import { Filter3 } from '@holi/icons/src/generated'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Button } from 'holi-bricks/components/button'
import { Spacing } from 'holi-bricks/foundations'

interface Props extends HoliModalProps {
  actionButtonVisible: boolean
  buttonLabel: string
  open: () => void
}

const FilterModal = ({ actionButtonVisible = false, open, testID = 'filter-modal', ...props }: Props) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  return (
    <View>
      {/* Floating filter button */}
      <View style={[mixins.container, styles.overlayButtonWrapper]}>
        <HoliTransition.FadeRight visible={actionButtonVisible}>
          <View style={styles.overlayButton}>
            <Button
              label={t('spaces.filter.button.text')}
              testID={`${testID}--open-btn`}
              inline
              onPress={open}
              icon={Filter3}
            />
          </View>
        </HoliTransition.FadeRight>
      </View>

      {/* Filter modal */}
      <HoliModal relativeHeight={1} autoHeight={false} testID={testID} {...props} />
    </View>
  )
}

const styles = StyleSheet.create({
  overlayButtonWrapper: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 0,
  },
  overlayButton: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? dimensions.bottomBarHeight : 0,
    right: 0,
    zIndex: 2,
    margin: Spacing.xxs,
  },
})

export default FilterModal
