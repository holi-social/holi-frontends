import { useQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

import { VolunteeringCitiesQuery, VolunteeringCitiesQueryResult } from '@holi-apps/volunteering/queries'

export type VolunteeringFilters = {
  location?: string
}

type VolunteeringFilterFormProps = {
  filters?: VolunteeringFilters
  onSubmit: (location?: string) => void
}

const VolunteeringFilterForm: React.VFC<VolunteeringFilterFormProps> = ({
  onSubmit,
  filters = {},
}: VolunteeringFilterFormProps) => {
  const { t } = useTranslation()
  const [location, setLocation] = useState(filters.location)

  const { data } = useQuery<VolunteeringCitiesQueryResult>(VolunteeringCitiesQuery)

  const cities = data?.appVolunteering_cities.data || []

  const locationOptions: HoliSelectOption[] = cities.map((city) => ({
    id: city.name,
    title: city.name,
    selected: city.name === location,
  }))

  const toggleLocationSelection = useCallback(
    (option: HoliSelectOption) => setLocation(option.selected ? undefined : option.id),
    [setLocation]
  )

  return (
    <HoliModalContentWrapper
      actionButtonText={t('volunteering:filter.submitButton')}
      onActionButtonPress={() => onSubmit(location)}
      style={styles.modalWrapper}
      testID="volunteering-filter-modal"
      keyboardShouldPersistTaps="always"
      scrollable={false}
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
  },
  modalWrapper: {
    flex: 1,
  },
})
