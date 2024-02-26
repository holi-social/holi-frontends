import { useMutation } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import FormWrapper from '@holi/core/components/FormWrapper'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import SpaceLocationInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLocationInput'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface EditSpaceLocationProps {
  space: Space
  onDismiss: () => void
}

const EditSpaceLocation: React.VFC<EditSpaceLocationProps> = ({ space, onDismiss }: EditSpaceLocationProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    space.location ? { label: space.location, id: '', coordinates: space.geolocation } : undefined
  )
  const [validationErrorText, setValidationErrorText] = useState('')
  const [locationQuery, setLocationQuery] = useState(space?.location || '')

  const [updateSpace] = useMutation(updateSpaceMutation, {
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

  const onSave = async () => {
    if (!selectedLocation && locationQuery.length) {
      setValidationErrorText(t('spaces.input.location.validation.helper'))
      return
    }

    const locationUpdate =
      !!locationQuery && locationQuery !== space.location
        ? {
            location: selectedLocation?.label,
            geolocation: {
              latitude: selectedLocation?.coordinates?.latitude,
              longitude: selectedLocation?.coordinates?.longitude,
            },
          }
        : {
            location: '',
          }

    return updateSpace({
      variables: {
        input: {
          id: space.id,
          ...locationUpdate,
        },
      },
    })
  }

  const onLocationClose = useCallback(
    (selectedSuggestion?: GeolocationSuggestion) => {
      setSelectedLocation(selectedSuggestion)

      if (!selectedSuggestion && locationQuery.length) {
        setValidationErrorText(t('spaces.input.location.validation.helper'))
      } else {
        setValidationErrorText('')
      }
    },
    [locationQuery.length, t]
  )

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
        saveButtonDisabled={!selectedLocation && !!locationQuery}
        keyboardShouldPersistTaps="handled"
        testID="space-edit-modal"
        showBottomBar
        renderProp={() => (
          <SpaceLocationInput
            description={t('spaces.input.location.description')}
            onChange={setSelectedLocation}
            location={selectedLocation}
            validationErrorText={validationErrorText}
            onLocationClose={onLocationClose}
            onChangeText={setLocationQuery}
            fetchDetailsOnClose
          />
        )}
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

export default EditSpaceLocation
