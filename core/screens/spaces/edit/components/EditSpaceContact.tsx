import { useMutation } from '@apollo/client/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { Space } from '@holi/api/graphql/graphql-codegen'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import SpaceContactForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactForm'
import { UpdateSpaceInputSchema, updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface EditSpaceContactProps {
  space: Pick<Space, 'id' | 'contactDescription' | 'contactPhone' | 'contactEmail'>
  onDismiss: () => void
}

const EditSpaceContact: React.FC<EditSpaceContactProps> = ({ space, onDismiss }: EditSpaceContactProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [contactDescription, setContactDescription] = useState<string>(space.contactDescription || '')
  const [contactPhone, setContactPhone] = useState<string>(space.contactPhone || '')
  const [contactEmail, setContactEmail] = useState<string>(space.contactEmail || '')

  const [inputValid, setInputValid] = useState(true)
  const { openToast } = useToast()
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const { handleGraphQLError } = useFieldErrors({
    i18nPrefix: 'spaces',
    handledFieldErrors: ['contactDescription', 'contactPhone', 'contactEmail'],
  })

  useEffect(() => {
    const resultSchema = UpdateSpaceInputSchema.safeParse({
      id: space.id,
      ...(contactDescription ? { contactDescription } : {}),
      ...(contactEmail ? { contactEmail } : {}),
      ...(contactPhone ? { contactPhone } : {}),
    })
    setInputValid(resultSchema.success)
    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [contactDescription, contactEmail, contactPhone, space.id, setInputValid])

  const [updateSpace] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
        onDismiss()
      } else {
        setFieldErrors(handleGraphQLError(error))
      }
    },
  })

  const { t } = useTranslation()

  const onSave = () =>
    updateSpace({
      variables: {
        input: {
          id: space.id,
          contactDescription: contactDescription,
          contactPhone: contactPhone,
          contactEmail: contactEmail,
        },
      },
    })

  return (
    <DefaultLayout
      headerOverlap={true}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
      scrollable={false}
    >
      <SpaceContactForm
        onChangeContactDescription={setContactDescription}
        onChangeContactPhone={setContactPhone}
        onChangeContactEmail={setContactEmail}
        contactDescription={contactDescription}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        contactDescriptionErrors={fieldErrors.contactDescription}
        contactEmailErrors={fieldErrors.contactEmail}
        contactPhoneErrors={fieldErrors.contactPhone}
        onSave={onSave}
        saveButtonDisabled={!inputValid}
      />
    </DefaultLayout>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layoutStyle: {
      flex: 1,
    },
    contentStyle: {
      flex: 1,
      paddingBottom: 0,
      backgroundColor: theme.colors.background20,
    },
  })

export default EditSpaceContact
