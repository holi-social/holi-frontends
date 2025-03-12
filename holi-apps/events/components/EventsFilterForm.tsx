import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Close } from '@holi/icons/src/generated'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'

import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'
import { Selector } from 'holi-bricks/components/selectors'
import { SelectableCard } from 'holi-bricks/components/selectors/Selectable'
import { Spacing } from 'holi-bricks/tokens'
import { Stack } from 'holi-bricks/components/stack'

export type EventFilters = {
  remote?: boolean
  date?: string
}

export type EventFilterParams = {
  remote?: string
  date?: string
}

export type EventFilterFormProps = {
  filters: EventFilters
  onSubmit: (filters?: EventFilters) => void
}

const EventsFilterForm = ({ onSubmit }: EventFilterFormProps) => {
  const { t } = useTranslation()
  const [selectedRemote, setSelectedRemote] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState<string>('3')

  const submit = useCallback(() => {
    onSubmit({
      remote: selectedRemote,
      date: selectedDate,
    })
  }, [onSubmit, selectedRemote, selectedDate])

  const resetForm = () => {
    setSelectedRemote(true)
    setSelectedDate('3')
  }

  return (
    <HoliModalContentWrapper
      actionButtonText={t('act.events.filter.submitButton')}
      onActionButtonPress={submit}
      style={styles.modalWrapper}
      keyboardShouldPersistTaps="handled"
      scrollable={false}
      hideFooterWhenKeyboardIsOpen={true}
    >
      <View style={styles.modalContent}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap="3xs">
          <Text size="3xl">{t('act.events.filter.heading')}</Text>
          <Button label={t('global.reset')} inline onPress={resetForm} variant="secondary" size="sm" icon={Close} />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Text size="md">Zeige Remote-Events</Text>
          <HoliSwitch value={selectedRemote} size="small" onChange={setSelectedRemote} />
        </Stack>
        <Stack gap="3xs">
          <Text size="sm">Wann</Text>
          {/* todo: reset doesnt work on selector because you cant set the selected option from outside. need to change selection logic for this to work */}
          <Selector
            inputType="radio"
            initiallySelectedOptions={['3']}
            onChange={(selectedOptions: string[]) => {
              setSelectedDate(selectedOptions[0])
            }}
          >
            <SelectableCard title="Diese Woche" id="1" />
            <SelectableCard title="Diesen Monat" id="2" />
            <SelectableCard title="Jederzeit" id="3" />
          </Selector>
        </Stack>
      </View>
    </HoliModalContentWrapper>
  )
}

export default EventsFilterForm

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
  },
  modalContent: {
    padding: Spacing.xs,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
    height: '100%',
    flexShrink: 1,
  },
})
