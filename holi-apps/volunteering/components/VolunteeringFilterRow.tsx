import React, { useState } from 'react'
import { FlatList, Platform } from 'react-native'
import type { VolunteeringFilterKey, VolunteeringFilters } from '@holi-apps/volunteering/types'
import { ChipAction } from 'holi-bricks/components/chips'
import { useTranslation } from 'react-i18next'
import partition from 'lodash.partition'
import { ArrowDownS, Edit2 } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { VolunteeringFilterModal } from '@holi-apps/volunteering/components/VolunteeringFilterModal'
import { filterTranslationKeyMapping } from '@holi-apps/volunteering/hooks/useVolunteeringFilterOptions'

export interface VolunteeringFilterRowProps {
  filters: VolunteeringFilters
  onSubmit: (filters?: VolunteeringFilters) => void
}

const isFilterSelected = (filterKey: VolunteeringFilterKey, filters: VolunteeringFilters) => {
  const value = filters[filterKey]
  return !!value && (!Array.isArray(value) || !!value.length)
}

const defaultOrder: VolunteeringFilterKey[] = [
  'location',
  'topics',
  'commitmentDurations',
  'commitmentLabels',
  'skills',
]

const getFilterChipOrder = (filters: VolunteeringFilters) => {
  const [selected, unselected] = partition(defaultOrder, (key) => isFilterSelected(key, filters))

  return [...selected, ...unselected]
}

interface FilterChipProps {
  filterKey: VolunteeringFilterKey
  filters: VolunteeringFilters
  onPress: () => void
}

const buildArrayLabel = (label: string, count: number) => (count > 1 ? `${label} + ${count - 1}` : label)

const FilterChip = ({ filterKey, filters, onPress }: FilterChipProps) => {
  const { t } = useTranslation()
  const selected = isFilterSelected(filterKey, filters)
  const field = filters[filterKey]

  const filterName = t(`volunteering.filter.${filterKey}.label`)

  const label = selected
    ? Array.isArray(field)
      ? buildArrayLabel(t(`${filterTranslationKeyMapping[filterKey]}.${field[0]}`), field.length)
      : field?.label // Geolocation
    : filterName

  return (
    <ChipAction
      color={selected ? 'white' : 'mono'}
      size="lg"
      iconTrailing={filterKey === 'location' ? Edit2 : ArrowDownS}
      aria-label={t('volunteering.filter.openModal', { filter: filterName })}
      onPress={onPress}
      testID={`volunteering-filter-${filterKey}`}
    >
      {label}
    </ChipAction>
  )
}

export const VolunteeringFilterRow = ({ filters, onSubmit }: VolunteeringFilterRowProps) => {
  const mixins = useStyleMixins()
  const chipOrder = getFilterChipOrder(filters)

  const [selectedFilter, setSelectedFilter] = useState<VolunteeringFilterKey | undefined>()

  return (
    <>
      <FlatList
        horizontal={true}
        data={chipOrder}
        renderItem={({ item }) => (
          <FilterChip key={item} filterKey={item} filters={filters} onPress={() => setSelectedFilter(item)} />
        )}
        style={mixins.container}
        contentContainerStyle={{
          paddingVertical: Spacing.xs,
          paddingRight: Platform.OS != 'web' ? Spacing.xs * 2 : undefined,
          gap: Spacing['4xs'],
        }}
      />
      {selectedFilter && (
        <VolunteeringFilterModal
          filterKey={selectedFilter}
          filters={filters}
          onSubmit={onSubmit}
          closeModal={() => setSelectedFilter(undefined)}
        />
      )}
    </>
  )
}
