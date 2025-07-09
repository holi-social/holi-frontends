import React, { useCallback, useState } from 'react'
import { Pressable } from 'react-native'
import type { VolunteeringFilterKey, VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useTranslation } from 'react-i18next'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { VolunteeringArrayFilterSelection } from '@holi-apps/volunteering/components/VolunteeringArrayFilterSelection'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { VolunteeringLocationFilterSelection } from '@holi-apps/volunteering/components/VolunteeringLocationFilterSelection'

export interface VolunteeringFilterModalProps<T extends VolunteeringFilterKey> {
  filterKey: T
  filters: VolunteeringFilters
  onSubmit: (filters?: VolunteeringFilters) => void
  closeModal: () => void
}

type ArrayFilter = string[] | undefined
type LocationFilter = GeolocationSuggestion | undefined

export const VolunteeringFilterModal = <T extends keyof VolunteeringFilters>({
  filterKey,
  filters,
  onSubmit,
  closeModal,
}: VolunteeringFilterModalProps<T>) => {
  const { t } = useTranslation()
  const [selection, setSelection] = useState<ArrayFilter | LocationFilter>(filters[filterKey])
  const searchableOptions = ['topics', 'skills', 'location'].includes(filterKey)

  const submitSelection = useCallback(() => {
    onSubmit({
      ...filters,
      [filterKey]: selection,
    })
    closeModal()
  }, [closeModal, filterKey, filters, onSubmit, selection])

  return (
    <HoliModal
      shown={true}
      onDismiss={closeModal}
      testID="volunteering-filter-modal"
      label={t(`volunteering.filter.${filterKey}Modal.title`)}
      autoHeight={!searchableOptions}
      headerStyle={{ paddingBottom: 0 }}
    >
      <HoliModalContentWrapper
        actionButtonText={t(`volunteering.filter.${filterKey}Modal.saveButton`)}
        onActionButtonPress={submitSelection}
        scrollable={true}
        buttonStyle={{ paddingTop: Spacing.xs }}
        style={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Stack padding={{ left: 'xs', right: 'xs' }} gap="xxs">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Text size="lg">{t(`volunteering.filter.${filterKey}Modal.title`)}</Text>
            <Pressable onPress={() => setSelection(undefined)}>
              <Stack direction="row" gap="4xs" padding={{ top: '3xs', bottom: '3xs' }}>
                <TextLink size="sm">{t('search.filter.reset')}</TextLink>
                <HoliIcon icon={Delete} size={20} />
              </Stack>
            </Pressable>
          </Stack>

          {filterKey === 'location' ? (
            <VolunteeringLocationFilterSelection selected={selection as LocationFilter} onSelect={setSelection} />
          ) : (
            <VolunteeringArrayFilterSelection
              filterKey={filterKey}
              selected={selection as ArrayFilter}
              onSelect={setSelection}
              searchable={searchableOptions}
            />
          )}
        </Stack>
      </HoliModalContentWrapper>
    </HoliModal>
  )
}
