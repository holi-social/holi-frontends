import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'

import EditSpaceModal, { EditSpaceModalProps } from './EditSpaceModal'

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
      <HoliButton label={t('global.dismiss')} type="secondary" inline style={styles.footerButton} onPress={onDismiss}>
        {t('global.dismiss')}
      </HoliButton>
      <HoliButtonLoading
        disabled={saveButtonDisabled}
        label={t('global.save')}
        onPress={onSave}
        testID="space-edit-modal-save-btn"
        style={styles.footerButton}
      />
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
