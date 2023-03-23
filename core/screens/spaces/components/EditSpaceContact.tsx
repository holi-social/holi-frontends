import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import EditSpaceModal from '@holi/core/screens/spaces/components/EditSpaceModal'
import SpaceContactForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactForm'
import { Space } from '@holi/core/screens/spaces/types'

interface EditSpaceContactProps {
  space: Space
  onDismiss: () => void
}

const EditSpaceContact: React.VFC<EditSpaceContactProps> = ({ /* space, */ onDismiss }: EditSpaceContactProps) => {
  const [spaceContactDescription, setSpaceContactDescription] = useState<string>('')
  const [spacePhone, setSpacePhone] = useState<number>(0)
  const [spaceMail, setSpaceMail] = useState<string>('')

  const [inputValid /* setInputValid */] = useState(true)
  /*   const { openToast } = useToast()
   */ const [fieldErrors /* setFieldErrors */] = useState<TranslatedFieldErrors>({})
  // const { handleGraphQLError } = useFieldErrors({ i18nPrefix: 'spaces', handledFieldErrors: ['title', 'description'] })

  // useEffect(() => {
  //   const resultSchema = UpdateSpaceInputSchema.safeParse({
  //     id: space.id,
  //     title: spaceName,
  //     description: spaceGoal,
  //   })
  //   setInputValid(resultSchema.success)
  //   if (!resultSchema.success) {
  //     setFieldErrors(resultSchema.error.flatten().fieldErrors)
  //   } else {
  //     setFieldErrors({})
  //   }
  // }, [spaceName, spaceGoal, space.id, setInputValid])

  // const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
  //   onCompleted: () => {
  //     openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
  //     onDismiss()
  //   },
  //   onError: (error) => setFieldErrors(handleGraphQLError(error)),
  // })

  const { t } = useTranslation()

  const onSave = () => {
    // updateSpace({ variables: { input: { id: space.id, title: spaceName, description: spaceGoal } } })
    setSpaceContactDescription(spaceContactDescription)
    setSpacePhone(spacePhone)
    setSpaceMail(spaceMail)
  }

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={!inputValid}>
      <SpaceContactForm
        title={t('spaces.input.nameAndGoal.title')}
        onChangeSpaceContactDescription={setSpaceContactDescription}
        onChangeSpaceMail={setSpaceMail}
        onChangeSpacePhone={setSpacePhone}
        spaceContactDescription={spaceContactDescription}
        spaceMail={spaceMail}
        spacePhone={spacePhone}
        spaceContactDescriptionErrors={fieldErrors.description}
        spaceMailErrors={fieldErrors.description}
        spacePhoneErrors={fieldErrors.description}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceContact
