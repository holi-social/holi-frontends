import { useQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

import { VolunteeringCategoriesQuery, VolunteeringCategoriesQueryResult } from '@holi-apps/volunteering/queries'
import { VolunteeringFilters } from '@holi-apps/volunteering/types'

type VolunteeringFilterFormProps = {
  filters?: VolunteeringFilters
  initialLocationSelection?: GeolocationSuggestion
  onSubmit: (filters?: VolunteeringFilters) => void
}

const VolunteeringFilterForm: React.VFC<VolunteeringFilterFormProps> = ({
  onSubmit,
  filters = {},
  initialLocationSelection,
}: VolunteeringFilterFormProps) => {
  const { t } = useTranslation()

  const [category, setCategory] = useState(filters.category)
  const [locationQuery, setLocationQuery] = useState(initialLocationSelection?.label || '')
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(initialLocationSelection)

  const {
    data: categoriesData,
    loading,
    error,
  } = useQuery<VolunteeringCategoriesQueryResult>(VolunteeringCategoriesQuery)

  if (error) {
    logError(error, `[VolunteeringFilterForm.tsx] ${error.message}`)
  }

  const categories = categoriesData?.appVolunteering_categories.data || []

  const topicOptions: HoliSelectOption[] = categories.map((_category) => ({
    id: _category.name,
    title: _category.name,
    selected: _category.name === category,
  }))

  const toggleTopicSelection = useCallback(
    (option: HoliSelectOption) => setCategory(option.selected ? undefined : option.id),
    [setCategory]
  )

  const toggleLocationSelection = useCallback(() => {
    setLocationQuery(initialLocationSelection?.label || '')
    setSelectedLocation(initialLocationSelection)
  }, [initialLocationSelection])

  const submit = useCallback(() => {
    return onSubmit({
      location: selectedLocation?.id,
      category,
    })
  }, [onSubmit, selectedLocation, category])

  return (
    <HoliModalContentWrapper
      actionButtonText={t('volunteering:filter.submitButton')}
      onActionButtonPress={submit}
      style={styles.modalWrapper}
      testID="volunteering-filter-modal"
      keyboardShouldPersistTaps="handled"
      scrollable={false}
      loading={loading}
      hideFooterWhenKeyboardIsOpen={true}
    >
      <View style={styles.container}>
        <HoliHeading>{t('volunteering:filter.heading')}</HoliHeading>
        <PlacesAutocomplete
          label={t('volunteering:filter.location.label')}
          placeholder={t('volunteering:filter.location.placeholder')}
          value={locationQuery}
          id="volunteering-filter-location"
          testID="volunteering-filter-location"
          onClose={setSelectedLocation}
          onChangeText={toggleLocationSelection}
          style={[styles.filterOption, { zIndex: 1 }]}
          inputProps={{ autoFocus: true }}
          fetchDetailsOnClose
        />
        <HoliSelect
          options={topicOptions}
          inputLabel={t('volunteering:filter.category.label')}
          accessibilityLabel={t('volunteering:filter.category.label')}
          placeholder={t('volunteering:filter.category.placeholder')}
          style={[styles.filterOption, { zIndex: 0 }]}
          onChange={toggleTopicSelection}
          id="volunteering-filter-category"
          testID="volunteering-filter-category"
        />
      </View>
    </HoliModalContentWrapper>
  )
}

export default VolunteeringFilterForm

const styles = StyleSheet.create({
  filterOption: {
    marginTop: 24,
  },
  container: {
    height: '100%',
    marginHorizontal: 16,
    paddingTop: 32,
  },
  modalWrapper: {
    flex: 1,
  },
})
