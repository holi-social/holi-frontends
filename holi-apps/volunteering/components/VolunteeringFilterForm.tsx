import { useQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

import {
  VolunteeringCategoriesQuery,
  VolunteeringCategoriesQueryResult,
  VolunteeringCitiesQuery,
  VolunteeringCitiesQueryResult,
} from '@holi-apps/volunteering/queries'

export type VolunteeringFilters = {
  location?: string
  topic?: string
}

type VolunteeringFilterFormProps = {
  filters?: VolunteeringFilters
  onSubmit: (filters?: VolunteeringFilters) => void
}

const VolunteeringFilterForm: React.VFC<VolunteeringFilterFormProps> = ({
  onSubmit,
  filters = {},
}: VolunteeringFilterFormProps) => {
  const { t } = useTranslation()
  const [location, setLocation] = useState(filters.location)
  const [topic, setTopic] = useState(filters.topic)

  const {
    data: locationData,
    loading: locationLoading,
    error: locationError,
  } = useQuery<VolunteeringCitiesQueryResult>(VolunteeringCitiesQuery)

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<VolunteeringCategoriesQueryResult>(VolunteeringCategoriesQuery)

  const error = locationError || categoriesError

  const loading = locationLoading || categoriesLoading

  if (error) {
    logError(error, `[VolunteeringFilterForm.tsx] ${error.message}`)
  }
  const cities = locationData?.appVolunteering_cities.data || []

  const locationOptions: HoliSelectOption[] = cities.map((city) => ({
    id: city.name,
    title: city.name,
    selected: city.name === location,
  }))

  const toggleLocationSelection = useCallback(
    (option: HoliSelectOption) => setLocation(option.selected ? undefined : option.id),
    [setLocation]
  )

  const categories = categoriesData?.appVolunteering_categories.data || []

  const topicOptions: HoliSelectOption[] = categories.map((category) => ({
    id: category.name,
    title: category.name,
    selected: category.name === topic,
  }))

  const toggleTopicSelection = useCallback(
    (option: HoliSelectOption) => setTopic(option.selected ? undefined : option.id),
    [setTopic]
  )

  return (
    <HoliModalContentWrapper
      actionButtonText={t('volunteering:filter.submitButton')}
      onActionButtonPress={() => onSubmit({ location, topic })}
      style={styles.modalWrapper}
      testID="volunteering-filter-modal"
      keyboardShouldPersistTaps="always"
      scrollable={false}
      loading={loading}
    >
      <View style={styles.container}>
        <HoliHeading>{t('volunteering:filter.heading')}</HoliHeading>
        <HoliSelect
          options={locationOptions}
          inputLabel={t('volunteering:filter.location.label')}
          accessibilityLabel={t('volunteering:filter.location.label')}
          placeholder={t('volunteering:filter.location.placeholder')}
          style={[styles.filterOption, { zIndex: 1 }]}
          onChange={toggleLocationSelection}
          id="volunteering-filter-location"
          testID="volunteering-filter-location"
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
