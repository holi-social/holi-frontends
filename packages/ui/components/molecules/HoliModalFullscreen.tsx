import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close } from '@holi/icons/src/generated'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import ModalBasic, { type ModalBasicProps } from '@holi/ui/components/molecules/ModalBasic'
import { useTheme } from '@holi/ui/styles/theme'

export interface HoliModalFullscreenProps extends ModalBasicProps {
  backgroundColor?: string
}

const HoliModalFullscreen: React.FC<HoliModalFullscreenProps> = ({
  shown,
  onDismiss,
  testID,
  label,
  style,
  backgroundColor,
  children,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <ModalBasic shown={shown} label={label} onDismiss={onDismiss} animationType="fade" testID={testID}>
      <View style={[styles.modalContent, style, { backgroundColor: backgroundColor || colors.foreground30 }]}>
        <SafeArea style={styles.closeBtnSafeArea}>
          <View style={styles.closeBtnWrapper}>
            <HoliButton
              label={t('modal.close')}
              onPress={onDismiss}
              inline
              transparent
              style={styles.closeBtn}
              testID="fullscreen-modal-close-btn"
            >
              <HoliIcon icon={Close} colorOverride={colors.background10} />
            </HoliButton>
          </View>
        </SafeArea>

        {children}
      </View>
    </ModalBasic>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
  },
  closeBtnSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeBtnWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 26,
  },
})

export default HoliModalFullscreen
