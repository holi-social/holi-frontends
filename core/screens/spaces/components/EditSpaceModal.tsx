import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { useKeyboard, useSoftKeyboard } from '@holi/ui/helper'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type EditSpaceModalProps = {
  onDismiss: () => void
  onSave: () => void
  children: ReactNode
  saveButtonDisabled?: boolean
}

const EditSpaceModal: React.FC<EditSpaceModalProps> = ({
  onDismiss,
  onSave,
  saveButtonDisabled = false,
  children,
}: EditSpaceModalProps) => {
  const { keyboardIsOpen } = useKeyboard()
  const { softkeyboardIsOpen } = useSoftKeyboard()
  const showFooter = !keyboardIsOpen && !softkeyboardIsOpen

  const mixins = useStyleMixins()

  const { t } = useTranslation()

  return (
    <DefaultLayout headerOverlap={true} style={styles.layoutStyle} contentStyle={styles.contentStyle}>
      <ScrollView style={[mixins.container, styles.scrollView]} keyboardShouldPersistTaps="always">
        {children}
      </ScrollView>
      {showFooter && (
        <View style={[mixins.container, styles.footer]}>
          <HoliButton
            label={t('global.dismiss')}
            type="secondary"
            inline
            style={styles.footerButton}
            onPress={onDismiss}
          >
            {t('global.dismiss')}
          </HoliButton>
          <HoliButtonLoading
            disabled={saveButtonDisabled}
            label={saveButtonDisabled ? t('global.loading') : t('global.save')}
            onPress={onSave}
            testID="edit-space-modal-save-btn"
            style={styles.footerButton}
            icon={saveButtonDisabled ? 'loader-4' : undefined}
            iconSpinning={saveButtonDisabled}
          />
        </View>
      )}
    </DefaultLayout>
  )
}

export default EditSpaceModal

const styles = StyleSheet.create({
  layoutStyle: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    paddingBottom: 0,
    backgroundColor: colors.background30,
  },
  scrollView: {
    paddingBottom: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    margin: -7,
    ...Platform.select({
      web: {
        margin: 0,
      },
    }),
  },
  footerButton: {
    flex: 1,
    margin: 7,
    ...Platform.select({
      web: {
        margin: 0,
      },
    }),
  },
})
