import { VolunteeringFilterModal } from '@holi-apps/volunteering/components/VolunteeringFilterModal'
import { filterKeyToTranslationKeyMapping } from '@holi-apps/volunteering/helpers/filterFacetData'
import { useFilterFacetCounts } from '@holi-apps/volunteering/hooks/useFilterFacetCounts'
import type {
  VolunteeringFilterKey,
  VolunteeringFilters,
  VolunteeringModalFilterKey,
} from '@holi-apps/volunteering/types'
import { ChipActionTracked, StackTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowDownS, Delete, Edit2, Global } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Stack } from 'holi-bricks/components/stack'
import { TextLink } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations'
import partition from 'lodash.partition'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform } from 'react-native'

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
  'remote',
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

  // Handle different filter types
  const label =
    filterKey === 'remote'
      ? filterName // Binary filter always shows the same label
      : selected
        ? Array.isArray(field)
          ? buildArrayLabel(t(`${filterKeyToTranslationKeyMapping[filterKey]}.${field[0]}`), field.length)
          : typeof field === 'object' && field && 'label' in field
            ? field.label // Geolocation
            : filterName
        : filterName

  // Remote filter has leading Global icon, location has Edit2 trailing, others have ArrowDownS trailing
  const iconLeading = filterKey === 'remote' ? Global : undefined
  const iconTrailing = filterKey === 'remote' ? undefined : filterKey === 'location' ? Edit2 : ArrowDownS

  // Better aria-label for remote filter (binary toggle) vs others (open modal)
  const ariaLabel =
    filterKey === 'remote'
      ? t('volunteering.filter.remote.toggle', { filter: filterName })
      : t('volunteering.filter.openModal', { filter: filterName })

  return (
    <ChipActionTracked
      selected={selected}
      size="lg"
      iconLeading={iconLeading}
      iconTrailing={iconTrailing}
      aria-label={ariaLabel}
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

  const [selectedFilter, setSelectedFilter] = useState<VolunteeringModalFilterKey | undefined>()

  const handleFilterPress = (filterKey: VolunteeringFilterKey) => {
    // For binary remote filter, toggle it directly
    if (filterKey === 'remote') {
      const newRemoteValue = !filters.remote
      onSubmit({
        ...filters,
        remote: newRemoteValue,
        // Clear location when remote is turned on
        location: newRemoteValue ? undefined : filters.location,
      })
    } else {
      // For other filters, open modal
      setSelectedFilter(filterKey)
    }
  }

  return (
    <Stack gap="4xs" padding={{ top: 'xs', bottom: '3xs' }}>
      <FlatList
        horizontal={true}
        data={chipOrder}
        renderItem={({ item }) => (
          <FilterChip key={item} filterKey={item} filters={filters} onPress={() => handleFilterPress(item)} />
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
