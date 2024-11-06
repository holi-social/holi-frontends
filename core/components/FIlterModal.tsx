import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Filter3 } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface Props extends HoliModalProps {
  actionButtonVisible: boolean
  buttonLabel: string
  open: () => void
}

const FilterModal = ({ actionButtonVisible = false, open, testID = 'filter-modal', ...props }: Props) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View>
      {/* Floating filter button */}
      <View style={[mixins.container, styles.overlayButtonWrapper]}>
        <HoliTransition.FadeRight visible={actionButtonVisible}>
          <HoliButton
            label={props.label}
            testID={`${testID}--open-btn`}
            inline
            style={styles.overlayButton}
            onPress={open}
          >
            <HoliText size="small" bold>
              {t('spaces.filter.button.text')}
            </HoliText>
            <HoliIcon icon={Filter3} size={16} color={colors.foreground30} style={styles.icon} />
          </HoliButton>
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
    bottom: (Platform.OS === 'web' ? dimensions.bottomBarHeight : 0) + 16,
    right: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  icon: {
    marginLeft: 6,
    marginBottom: 2,
  },
})

export default FilterModal
