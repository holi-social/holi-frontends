import React from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalBasic, { HoliModalBasicProps } from '@holi/ui/components/molecules/HoliModalBasic'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliModalFullscreenProps extends HoliModalBasicProps {
  backgroundColor?: string
}

const HoliModalFullscreen: React.FC<HoliModalFullscreenProps> = ({
  show,
  onDismiss,
  testID,
  label,
  style,
  backgroundColor = colors.backgroundColorModalDark,
  children,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <StatusBar animated backgroundColor={backgroundColor} />

      <HoliModalBasic show={show} label={label} onDismiss={onDismiss} animationType="fade" testID={testID}>
        <View style={[styles.modalContent, style, { backgroundColor: backgroundColor }]}>
          <SafeAreaView style={styles.closeBtnSafeArea}>
            <View style={styles.closeBtnWrapper}>
              <HoliButton label={t('modal.backdrop')} onPress={onDismiss} inline transparent style={styles.closeBtn}>
                <HoliIcon icon="close" color={colors.fontColorModalLight} />
              </HoliButton>
            </View>
          </SafeAreaView>

          {children}
        </View>
      </HoliModalBasic>
    </>
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
