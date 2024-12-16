import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import EditSpaceModal, { type EditSpaceModalProps } from './EditSpaceModal'
import { Button } from 'holi-bricks/components/button'

type FooterButtonsProps = {
  onDismiss: () => void
  onSave: () => Promise<unknown>
  saveButtonDisabled?: boolean
}

type EditSpaceModalWithFooterProps = EditSpaceModalProps & FooterButtonsProps

const FooterButtons = ({ onDismiss, onSave, saveButtonDisabled }: FooterButtonsProps) => {
  const { t } = useTranslation()

  return (
    <>
      <View style={styles.footerButton}>
        <Button label={t('global.dismiss')} variant="secondary" inline onPress={onDismiss} />
      </View>
      <View style={styles.footerButton}>
        <Button
          disabled={saveButtonDisabled}
          label={t('global.save')}
          onPress={onSave}
          testID="space-edit-modal-save-btn"
        />
      </View>
    </>
  )
}

const EditSpaceModalWithFooter = ({
  onDismiss,
  onSave,
  saveButtonDisabled = false,
  ...modalProps
}: EditSpaceModalWithFooterProps) => {
  return (
    <EditSpaceModal
      {...modalProps}
      footer={<FooterButtons onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={saveButtonDisabled} />}
    />
  )
}

const styles = StyleSheet.create({
  footerButton: {
    flex: 1,
  },
})

export default EditSpaceModalWithFooter
