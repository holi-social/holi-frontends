import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Close } from '@holi/icons/src/generated'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'

import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'
import { Selector } from 'holi-bricks/components/selectors'
import { SelectableCard } from 'holi-bricks/components/selectors/Selectable'
import { Spacing } from 'holi-bricks/tokens'

export type EventFilters = {
  remote?: boolean
  date?: string
}

export type EventFilterParams = {
  remote?: string
  date?: string
}

export type VolunteeringFilterFormProps = {
  filters: EventFilters
  onSubmit: (filters?: EventFilters) => void
}

const EventsFilterForm = ({ onSubmit }: VolunteeringFilterFormProps) => {
  const { t } = useTranslation()
  const [selectedRemote, setSelectedRemote] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState<string>('3')

  const submit = useCallback(
    () =>
      onSubmit({
        remote: selectedRemote,
        date: selectedDate,
      }),
    [onSubmit, selectedRemote, selectedDate]
  )

  const resetForm = () => {
    setSelectedRemote(true)
    setSelectedDate('3')
  }

  return (
    <HoliModalContentWrapper
      actionButtonText={t('act.events.filter.submitButton')}
      onActionButtonPress={submit}
      style={styles.modalWrapper}
      testID="volunteering-filter-modal"
      keyboardShouldPersistTaps="handled"
      scrollable={false}
      hideFooterWhenKeyboardIsOpen={true}
    >
      <View style={styles.modalContent}>
        <View style={styles.chipSectionHeading}>
          <Text size="3xl">{t('act.events.filter.heading')}</Text>
          <Button label={t('global.reset')} inline onPress={resetForm} variant="secondary" size="sm" icon={Close} />
        </View>
        <View style={styles.remoteSwitch}>
          <Text size="md">Zeige Remote-Events</Text>
          <HoliSwitch value={selectedRemote} size="small" onChange={setSelectedRemote} />
        </View>
        {/* <View style={styles.districtFilter}>
          <Text size="sm">Bundesland</Text>
          <HoliSelect // todo, not working properly
            options={topicOptions}
            aria-label="Bundesland"
            placeholder="Berlin"
            style={styles.filterOption}
            onChange={toggleTopicSelection}
            id="event-filter-district"
            virtualized={true}
          />
        </View> */}
        <View style={styles.dateFilter}>
          <Text size="sm">Wann</Text>
          {/* todo: reset doesnt work on selector because you cant set the selected option from outside. need to change selection logic for this to work */}
          <Selector inputType="radio" initiallySelectedOptions={['3']}>
            <SelectableCard title="Diese Woche" id="1" />
            <SelectableCard title="Diesen Monat" id="2" />
            <SelectableCard title="Jederzeit" id="3" />
          </Selector>
        </View>
      </View>
    </HoliModalContentWrapper>
  )
}

const WrappedFilterForm = (props: VolunteeringFilterFormProps) => (
  <SpaceTermContextProvider>
    <EventsFilterForm {...props} />
  </SpaceTermContextProvider>
)

export default WrappedFilterForm

const styles = StyleSheet.create({
  filterOption: {
    zIndex: 100,
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
  modalContent: {
    padding: Spacing.xs,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
    height: '100%',
    flexShrink: 1,
  },
  chipSectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  remoteSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  districtFilter: {
    gap: 6,
  },
  dateFilter: {
    gap: Spacing['3xs'],
  },
})
