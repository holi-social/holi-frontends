import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import EditSpaceModal from '@holi/core/screens/spaces/components/EditSpaceModal'
import SpaceLocationInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLocationInput'
import { updateSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

interface EditSpaceLocationProps {
  space: Space
  onDismiss: () => void
}

const EditSpaceLocation: React.VFC<EditSpaceLocationProps> = ({ space, onDismiss }: EditSpaceLocationProps) => {
  const { openToast } = useToast()
  const [location, setLocation] = useState<string>('')

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: () => {
      openToast(t('global.technicalError'), HoliToastType.ERROR)
    },
  })

  const { t } = useTranslation()
  const onSave = () => updateSpace({ variables: { input: { id: space.id, location: location } } })

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={loading} scrollable={false}>
      <SpaceLocationInput
        title={t('spaces.input.location.title')}
        description={t('spaces.input.location.description')}
        onChange={setLocation}
        location={location}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceLocation
