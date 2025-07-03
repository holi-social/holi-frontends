import React from 'react'
import { FlatList } from 'react-native'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { ChipAction } from 'holi-bricks/components/chips'
import { useTranslation } from 'react-i18next'
import partition from 'lodash.partition'
import { ArrowDownS, Edit2 } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface VolunteeringFilterRowProps {
  filters: VolunteeringFilters
  onSubmit: (filters?: VolunteeringFilters) => void
}

type VolunteeringFilterKey = keyof VolunteeringFilters

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

// TODO(SF) probably move somewhere shared?
const filterTranslationKeyMapping: { [key in VolunteeringFilterKey]: string } = {
  topics: 'topic',
  skills: 'skill',
  location: 'location',
  commitmentLabels: 'volunteering.engagement.commitment_label',
  commitmentDurations: 'volunteering.engagement.commitment_duration',
}

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
    >
      {label}
    </ChipAction>
  )
}

export const VolunteeringFilterRow = ({ filters /*, onSubmit*/ }: VolunteeringFilterRowProps) => {
  const mixins = useStyleMixins()
  const chipOrder = getFilterChipOrder(filters)
  const toggleModal = () => {}

  return (
    <FlatList
      horizontal={true}
      data={chipOrder}
      renderItem={({ item }) => <FilterChip key={item} filterKey={item} filters={filters} onPress={toggleModal} />}
      style={mixins.container}
      contentContainerStyle={{
        paddingVertical: Spacing.xs,
        gap: Spacing['4xs'],
      }}
    />
  )
}
