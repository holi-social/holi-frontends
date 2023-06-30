import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import SpaceLocationInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLocationInput'
import EditSpaceModal from '@holi/core/screens/spaces/edit/components/EditSpaceModal'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

interface EditSpaceLocationProps {
  space: Space
  onDismiss: () => void
}

const EditSpaceLocation: React.VFC<EditSpaceLocationProps> = ({ space, onDismiss }: EditSpaceLocationProps) => {
  const { openToast } = useToast()
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    space.location ? { label: space.location, id: '', coordinates: space.geolocation } : undefined
  )
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
  }, [selectedLocation])

  const { t } = useTranslation()
  const onSave = () => {
    if (!selectedLocation) {
      setValidationErrorText(t('spaces.input.location.validation.helper'))
      return
    }
    updateSpace({
      variables: {
        input: {
          id: space.id,
          location: selectedLocation?.label,
          geolocation: {
            latitude: selectedLocation?.coordinates?.latitude,
            longitude: selectedLocation?.coordinates?.longitude,
          },
        },
      },
    })
  }

  return (
    <EditSpaceModal
      onDismiss={onDismiss}
      onSave={onSave}
      saveButtonDisabled={loading || !selectedLocation}
      scrollable={false}
    >
      <SpaceLocationInput
        title={t('spaces.input.location.title')}
        description={t('spaces.input.location.description')}
        onChange={setSelectedLocation}
        location={selectedLocation}
        validationErrorText={validationErrorText}
      />
    </EditSpaceModal>
  )
}

export default EditSpaceLocation
