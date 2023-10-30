import { useQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

import { VolunteeringCategoriesQueryResult, volunteeringCategoriesQuery } from '@holi-apps/volunteering/queries'
import { VolunteeringFilters } from '@holi-apps/volunteering/types'

type VolunteeringFilterFormProps = {
  filters?: VolunteeringFilters
  initialLocationSelection?: GeolocationSuggestion
  onSubmit: (filters?: VolunteeringFilters) => void
  setFilters?: (filters: { location: GeolocationSuggestion | undefined; category: string | undefined }) => void
  clearFilters?: () => void
}

const VolunteeringFilterForm: React.VFC<VolunteeringFilterFormProps> = ({
  onSubmit,
  filters = {},
  initialLocationSelection,
  setFilters,
  clearFilters,
}: VolunteeringFilterFormProps) => {
  const { t } = useTranslation()

  const [category, setCategory] = useState(filters.category)
  const [locationQuery, setLocationQuery] = useState(filters.location ? initialLocationSelection?.label : '')
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    filters.location ? initialLocationSelection : undefined
  )

  const { data: categoriesData, loading } = useQuery<VolunteeringCategoriesQueryResult>(volunteeringCategoriesQuery, {
    onError: (error) =>
      logError(error, 'Failed to load volunteering categories', {
        location: 'VolunteeringFilterForm.VolunteeringCategoriesQuery',
      }),
  })

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
    setLocationQuery(filters.location ? initialLocationSelection?.label : '')
    setSelectedLocation(filters.location ? initialLocationSelection : undefined)
  }, [initialLocationSelection, filters.location])

  const submit = useCallback(() => {
    setFilters && setFilters({ location: selectedLocation, category })
    return onSubmit({
      location: selectedLocation?.id,
      category,
    })
  }, [onSubmit, selectedLocation, category, setFilters])

  const resetForm = useCallback(() => {
    setLocationQuery(undefined)
    setSelectedLocation(undefined)
    setCategory(undefined)
    clearFilters && clearFilters()
  }, [clearFilters])

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
        <View style={styles.header}>
          <HoliHeading>{t('volunteering:filter.heading')}</HoliHeading>
          <HoliButton label={t('global.reset')} inline onPress={resetForm} type="secondary" variant="small">
            <HoliText>{t('global.reset')}</HoliText>
            <HoliIcon icon={Close} size={20} style={styles.clearFilters} />
          </HoliButton>
        </View>
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
          aria-label={t('volunteering:filter.category.label')}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearFilters: {
    paddingLeft: 3,
  },
})
