import { useVolunteeringFilterOptions } from '@holi-apps/volunteering/hooks/useVolunteeringFilterOptions'
import type { VolunteeringModalFilterKey } from '@holi-apps/volunteering/types'
import type { TypesenseFacetCounts } from '@holi/core/typesense/types'
import { Search } from '@holi/icons/src/generated'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { ChipSelect } from 'holi-bricks/components/chips'
import { Stack } from 'holi-bricks/components/stack'
import partition from 'lodash.partition'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface VolunteeringArrayFilterOption {
  term: string
  label: string
  counter?: number
}

interface VolunteeringArrayFilterSelectionProps {
  filterKey: Exclude<VolunteeringModalFilterKey, 'location'>
  selected?: string[]
  onSelect: (items: string[]) => void
  longListOfOptions?: boolean
  facetCounts?: TypesenseFacetCounts
}

export const VolunteeringArrayFilterSelection = ({
  filterKey,
  selected = [],
  onSelect,
  longListOfOptions = false,
  facetCounts,
}: VolunteeringArrayFilterSelectionProps) => {
  const { t } = useTranslation()
  const options: VolunteeringArrayFilterOption[] = useVolunteeringFilterOptions(filterKey, facetCounts)

  const sortedOptions = useMemo(() => {
    if (!longListOfOptions) {
      return options
    }
    const [selectedOptions, unselectedOptions] = partition(options, (option) => selected.includes(option.term))
    return [...selectedOptions, ...unselectedOptions]
  }, [options, selected, longListOfOptions])
  const [filterString, setFilterString] = useState('')

  const filteredOptions = useMemo(
    () =>
      filterString === ''
        ? sortedOptions
        : sortedOptions.filter((term) => term.label.toLowerCase().includes(filterString.toLowerCase())),
    [filterString, sortedOptions]
  )

  const updateSelection = useCallback(
    (term: string) => {
      if (selected.includes(term)) {
        // remove the value
        onSelect(selected.filter((selectedTerm) => selectedTerm !== term))
      } else if (selected.length < 6) {
        // add the value
        onSelect([...selected, term])
      }
    },
    [onSelect, selected]
  )

  return (
    <Stack gap="xxs" flex={1}>
      {longListOfOptions && (
        <HoliTextInput
          aria-label={t(`volunteering.filter.${filterKey}.placeholder`)}
          value={filterString}
          placeholder={t(`volunteering.filter.${filterKey}.placeholder`)}
          onChange={setFilterString}
          trailingIcon={Search}
          inputProps={{
            inputMode: 'search',
            returnKeyType: 'search',
            accessibilityRole: 'search',
            role: 'searchbox',
          }}
        />
      )}

      <Stack gap="3xs" wrap="wrap" direction="row" flexShrink={1} padding={{ bottom: 'md' }}>
        {filteredOptions.map((option) => (
          <ChipSelect
            size="lg"
            key={option.term}
            selected={selected.includes(option.term)}
            onPress={() => updateSelection(option.term)}
            selectedColor="yellowLight"
            testID={`${filterKey}--${option.term}`}
            counter={option.counter?.toString()}
          >
            {option.label}
          </ChipSelect>
        ))}
      </Stack>
    </Stack>
  )
}
