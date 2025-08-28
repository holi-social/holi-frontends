import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import FormWrapper, { FormWrapperProps } from '@holi/core/components/FormWrapper'
import SpaceContactDescriptionInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactDescriptionInput'
import SpaceContactEmailInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactEmailInput'
import SpaceContactPhoneInputWeb from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactPhoneInputWeb'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Global } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface SpaceContactFormProps extends Omit<FormWrapperProps, 'renderProp'> {
  onChangeContactDescription: (contactDescription: string) => void
  onChangeContactEmail: (contactEmail: string) => void
  onChangeContactPhone: (contactPhone: string) => void
  contactDescription: string
  contactEmail: string
  contactPhone: string
  contactDescriptionErrors?: string[]
  contactEmailErrors?: string[]
  contactPhoneErrors?: string[]
}
const SpaceContactForm = ({
  onChangeContactDescription,
  onChangeContactEmail,
  onChangeContactPhone,
  contactDescription,
  contactEmail,
  contactPhone,
  onSave,
  saveButtonDisabled,
  contactDescriptionErrors,
  contactEmailErrors,
  contactPhoneErrors,
  style,
}: SpaceContactFormProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <FormWrapper
      isModal={true}
      onSave={onSave}
      saveButtonDisabled={saveButtonDisabled}
      testID="space-edit-modal"
      showBottomBar
      renderProp={() => (
        <View style={[styles.container, style]}>
          <View style={styles.info}>
            <HoliIcon icon={Global} style={styles.infoIcon} />
            <HoliText style={styles.infoText}>{t('spaces.input.contact.info.text')}</HoliText>
          </View>
          <SpaceContactDescriptionInput
            value={contactDescription}
            onChange={onChangeContactDescription}
            errorMessage={contactDescriptionErrors?.length ? contactDescriptionErrors[0] : undefined}
          />
          <View style={styles.inputContainer}>
            <SpaceContactEmailInput
              value={contactEmail}
              onChange={onChangeContactEmail}
              errorMessage={contactEmailErrors?.length ? t('global.validation.email.invalid') : undefined}
            />
          </View>
          <View style={styles.inputContainer}>
            <SpaceContactPhoneInputWeb
              value={contactPhone}
              onChange={onChangeContactPhone}
              errorMessage={contactPhoneErrors?.length ? contactPhoneErrors[0] : undefined}
            />
          </View>
        </View>
      )}
    />
  )
}

export default SpaceContactForm

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingTop: 24,
      paddingBottom: 50,
    },
    info: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 24,
    },
    infoIcon: {
      marginRight: 4,
      color: theme.colors.foreground20,
    },
    infoText: {
      color: theme.colors.foreground20,
    },
    inputContainer: {
      marginTop: 24,
    },
  })
