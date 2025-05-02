import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Close } from '@holi/icons/src/generated'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'

import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'
import { Spacing } from 'holi-bricks/foundations'
import { Stack } from 'holi-bricks/components/stack'

export type EventFilters = {
  localOnly: boolean
  date?: string
}

export type EventFilterFormProps = {
  filters: EventFilters
  onSubmit: (filters: EventFilters) => void
}

const EventsFilterForm = ({ onSubmit, filters }: EventFilterFormProps) => {
  const { t } = useTranslation()
  const [localOnly, setLocalOnly] = useState<boolean>(filters.localOnly)
  // const [selectedDate, setSelectedDate] = useState<string>('3')

  const submit = useCallback(() => {
    onSubmit({
      localOnly: localOnly,
    })
  }, [onSubmit, localOnly])

  const resetForm = () => {
    setLocalOnly(false)
    // setSelectedDate('3')
  }

  return (
    <HoliModalContentWrapper
      actionButtonText={t('act.events.filter.submitButton')}
      onActionButtonPress={submit}
      keyboardShouldPersistTaps="handled"
      hideFooterWhenKeyboardIsOpen={true}
    >
      <View style={styles.modalContent}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap="3xs">
          <Text size="3xl">{t('act.events.filter.heading')}</Text>
          <Button
            disabled={localOnly}
            label={t('global.reset')}
            inline
            onPress={resetForm}
            variant="secondary"
            size="sm"
            icon={Close}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Text size="md">{t('core.act.events.filter.remote')}</Text>
          <HoliSwitch value={localOnly} size="small" onChange={setLocalOnly} />
        </Stack>
      </View>
    </HoliModalContentWrapper>
  )
}

export default EventsFilterForm

const styles = StyleSheet.create({
  modalContent: {
    padding: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    height: '100%',
    flexShrink: 1,
  },
})
