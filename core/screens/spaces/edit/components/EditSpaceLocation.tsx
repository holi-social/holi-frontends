import { useMutation } from '@apollo/client/react'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { Space } from '@holi/api/graphql/graphql-codegen'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import FormWrapper from '@holi/core/components/FormWrapper'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import SpaceLocationInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLocationInput'
import { updateSpaceMutation, type UpdateSpaceResponse } from '@holi/core/screens/spaces/edit/mutations'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface EditSpaceLocationProps {
  space: Pick<Space, 'id' | 'location' | 'geolocation'>
  onDismiss: () => void
}

const EditSpaceLocation: React.FC<EditSpaceLocationProps> = ({ space, onDismiss }: EditSpaceLocationProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    space.location ? { label: space.location, id: '', coordinates: space.geolocation || undefined } : undefined
  )
  const [validationErrorText, setValidationErrorText] = useState('')

  const [updateSpace] = useMutation<UpdateSpaceResponse>(updateSpaceMutation, {
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
    const locationUpdate =
      selectedLocation && selectedLocation?.label !== space.location
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

  const selectLocation = useCallback((selectedSuggestion?: GeolocationSuggestion) => {
    setSelectedLocation(selectedSuggestion)
    setValidationErrorText('')
  }, [])

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
        keyboardShouldPersistTaps="handled"
        testID="space-edit-modal"
        showBottomBar
        renderProp={() => (
          <SpaceLocationInput
            description={t('spaces.input.location.description')}
            location={selectedLocation}
            validationErrorText={validationErrorText}
            onChange={selectLocation}
            enhanceWithDetails
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
