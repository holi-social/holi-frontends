import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import FormWrapper from '@holi/core/components/FormWrapper'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import SpaceLocationInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLocationInput'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

interface EditSpaceLocationProps {
  space: Space
  onDismiss: () => void
}

const EditSpaceLocation: React.VFC<EditSpaceLocationProps> = ({ space, onDismiss }: EditSpaceLocationProps) => {
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    space.location ? { label: space.location, id: '', coordinates: space.geolocation } : undefined
  )
  const [validationErrorText, setValidationErrorText] = useState('')

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) => {
      displayError(error, 'Failed to update space', { location: 'EditSpaceLocation.updateSpace', spaceId: space.id })
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
    <DefaultLayout
      headerOverlap={true}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
      scrollable={false}
    >
      <FormWrapper
        isModal={true}
        onSave={onSave}
        saveButtonDisabled={loading || !selectedLocation}
        loading={loading}
        keyboardShouldPersistTaps="always"
        testID="space-edit-modal"
        showBottomBar
        renderProp={() => (
          <SpaceLocationInput
            title={t('spaces.input.location.title')}
            description={t('spaces.input.location.description')}
            onChange={setSelectedLocation}
            location={selectedLocation}
            validationErrorText={validationErrorText}
          />
        )}
      />
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  layoutStyle: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    paddingBottom: 0,
    backgroundColor: colors.background20,
  },
})

export default EditSpaceLocation
