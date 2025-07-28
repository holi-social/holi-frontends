import React, { useState } from 'react'
import { FlatList, Platform } from 'react-native'
import type { VolunteeringFilterKey, VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useTranslation } from 'react-i18next'
import partition from 'lodash.partition'
import { ArrowDownS, Delete, Edit2 } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { VolunteeringFilterModal } from '@holi-apps/volunteering/components/VolunteeringFilterModal'
import { ChipActionTracked, StackTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { useFilterFacetCounts } from '@holi-apps/volunteering/hooks/useFilterFacetCounts'
import { filterKeyToTranslationKeyMapping } from '@holi-apps/volunteering/helpers/filterFacetData'
import { Stack } from 'holi-bricks/components/stack'
import { TextLink } from 'holi-bricks/components/text'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

export interface VolunteeringFilterRowProps {
  filters: VolunteeringFilters
  onSubmit: (filters?: VolunteeringFilters) => void
  loadingFilters?: boolean
  clearFilters: () => void
  isFiltering?: boolean
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
      ? buildArrayLabel(t(`${filterKeyToTranslationKeyMapping[filterKey]}.${field[0]}`), field.length)
      : field?.label // Geolocation
    : filterName

  return (
    <ChipActionTracked
      color={selected ? 'white' : 'mono'}
      size="lg"
      iconTrailing={filterKey === 'location' ? Edit2 : ArrowDownS}
      aria-label={t('volunteering.filter.openModal', { filter: filterName })}
      onPress={onPress}
      testID={`volunteering-filter-${filterKey}`}
      trackingEvent={TrackingEvent.Volunteering.filterPillPressed(filterKey)}
    >
      {label}
    </ChipActionTracked>
  )
}

export const VolunteeringFilterRow = ({
  filters,
  onSubmit,
  loadingFilters,
  clearFilters,
  isFiltering = false,
}: VolunteeringFilterRowProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const chipOrder = getFilterChipOrder(filters)
  const { facetCounts } = useFilterFacetCounts({
    filters,
    loadingFilters,
  })

  const [selectedFilter, setSelectedFilter] = useState<VolunteeringFilterKey | undefined>()

  return (
    <Stack gap="4xs" padding={{ top: 'xs', bottom: '3xs' }}>
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
      {isFiltering && (
        <HoliContainer>
          <StackTracked
            direction="row"
            gap="4xs"
            onPress={clearFilters}
            alignItems="center"
            justifyContent="flex-end"
            trackingEvent={TrackingEvent.Volunteering.clearFiltersPressed}
          >
            <TextLink size="sm">{t('search.filter.reset.all')}</TextLink>
            <HoliIcon icon={Delete} size={20} />
          </StackTracked>
        </HoliContainer>
      )}
      {selectedFilter && (
        <VolunteeringFilterModal
          filterKey={selectedFilter}
          filters={filters}
          onSubmit={onSubmit}
          closeModal={() => setSelectedFilter(undefined)}
          facetCounts={facetCounts}
        />
      )}
    </Stack>
  )
}
