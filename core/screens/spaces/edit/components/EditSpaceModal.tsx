import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { Loader4 } from '@holi/icons/src/generated'
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
  loading?: boolean
  scrollable?: boolean
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps']
  persistFooter?: boolean
}

const EditSpaceModal: React.FC<EditSpaceModalProps> = ({
  onDismiss,
  onSave,
  saveButtonDisabled = false,
  loading = false,
  children,
  scrollable = true,
  keyboardShouldPersistTaps = 'always',
  persistFooter = true,
}: EditSpaceModalProps) => {
  const { isKeyboardOpen } = useKeyboard()
  const { isSoftkeyboardOpen } = useSoftKeyboard()
  const showFooter = persistFooter || (!isKeyboardOpen && !isSoftkeyboardOpen)

  const mixins = useStyleMixins()

  const { t } = useTranslation()

  return (
    <DefaultLayout
      headerOverlap={true}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
      scrollable={scrollable}
    >
      <ScrollView style={[mixins.container, styles.scrollView]} keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
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
            disabled={loading || saveButtonDisabled}
            label={loading ? t('global.loading') : t('global.save')}
            onPress={onSave}
            testID="space-edit-modal-save-btn"
            style={styles.footerButton}
            icon={loading ? Loader4 : undefined}
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
    backgroundColor: colors.background20,
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
  },
  footerButton: {
    flex: 1,
  },
})
