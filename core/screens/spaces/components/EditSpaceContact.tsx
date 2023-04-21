import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import EditSpaceModal from '@holi/core/screens/spaces/components/EditSpaceModal'
import SpaceContactForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactForm'
import { UpdateSpaceInputSchema, updateSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

interface EditSpaceContactProps {
  space: Space
  onDismiss: () => void
}

const EditSpaceContact: React.VFC<EditSpaceContactProps> = ({ space, onDismiss }: EditSpaceContactProps) => {
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

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
  })

  const { t } = useTranslation()

  const onSave = () => {
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
  }

  return (
    <EditSpaceModal
      onDismiss={onDismiss}
      onSave={onSave}
      saveButtonDisabled={loading || !inputValid}
      scrollable={false}
      keyboardShouldPersistTaps="never"
    >
      <SpaceContactForm
        title={t('space.input.contact.title')}
        onChangeContactDescription={setContactDescription}
        onChangeContactPhone={setContactPhone}
        onChangeContactEmail={setContactEmail}
        contactDescription={contactDescription}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        contactDescriptionErrors={fieldErrors.contactDescription}
        contactEmailErrors={fieldErrors.contactEmail}
        contactPhoneErrors={fieldErrors.contactPhone}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceContact
