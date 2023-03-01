import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
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
  const [location, setLocation] = useState<GeolocationSuggestion>()
  const [validationErrorText, setValidationErrorText] = useState('')

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: () => {
      openToast(t('global.technicalError'), HoliToastType.ERROR)
    },
  })

  useEffect(() => {
    setValidationErrorText('')
  }, [location])

  const { t } = useTranslation()
  const onSave = () => {
    if (!location) {
      setValidationErrorText(t('spaces.input.location.validation.error'))
      return
    }
    updateSpace({
      variables: {
        input: {
          id: space.id,
          location: location?.value,
          geolocation: {
            latitude: location?.coordinates?.latitude,
            longitude: location?.coordinates?.longitude,
          },
        },
      },
    })
  }

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} saveButtonDisabled={loading} scrollable={false}>
      <SpaceLocationInput
        title={t('spaces.input.location.title')}
        description={t('spaces.input.location.description')}
        onChange={setLocation}
        location={location}
        validationErrorText={validationErrorText}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceLocation
