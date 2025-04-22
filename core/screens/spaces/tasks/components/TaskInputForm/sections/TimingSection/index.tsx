import type React from 'react'
import { useTranslation } from 'react-i18next'

import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import HoliModalSelect from '@holi/ui/components/organisms/HoliModalSelect'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Button } from 'holi-bricks/components/button'
import { Duration, Regularity } from '@holi/api/graphql/graphql-codegen'

import type { UseTimingReturnValue } from './useTiming'

// use Regularity and Duration enums values as an array for correct order of options
const REGULARITY_VALUES: Regularity[] = [
  Regularity.OneTime,
  Regularity.OnceWeek,
  Regularity.SeveralTimesWeek,
  Regularity.OnceMonth,
  Regularity.Negotiable,
]

const DURATION_VALUES: Duration[] = [
  Duration.Minutes_10to15,
  Duration.Minutes_15to30,
  Duration.Minutes_30to60,
  Duration.Hours_1to2,
  Duration.Hours_2to4,
  Duration.Hours_4to6,
  Duration.Days_1,
  Duration.Days_2,
  Duration.Days_3OrMore,
]

const TimingSection = ({ regularity, onRegularityChange, duration, onDurationChange }: UseTimingReturnValue) => {
  const { t } = useTranslation()

  const { show: showRegularityModal, hide: hideRegularityModal, visible: visibleRegularityModal } = useModalState()
  const { show: showDurationModal, hide: hideDurationModal, visible: visibleDurationModal } = useModalState()

  return (
    <>
      <Stack margin={{ bottom: 'xs' }}>
        <Text size="xxl">{t('spaces.input.task.section.timing')}</Text>
      </Stack>

      <Stack margin={{ top: 'xxs' }}>
        <HoliModalSelect
          options={REGULARITY_VALUES.map((value) => ({
            id: value,
            title: t(`spaces.input.task.section.timing.regularity.value.${value}`),
            selected: value === regularity,
          }))}
          label={t('spaces.input.task.section.timing.regularity.label')}
          placeholder={t('spaces.input.task.section.timing.regularity.placeholder')}
          title={t('spaces.input.task.section.timing.regularity.modal.title')}
          description={t('spaces.input.task.section.timing.regularity.modal.description')}
          onChange={({ id }) => {
            onRegularityChange(id)
            return false
          }}
          modalFooter={
            <Button
              onPress={hideRegularityModal}
              label={t('spaces.input.task.section.timing.regularity.modal.saveButtonLabel')}
              testID="task-regularity-input-save-button"
            />
          }
          variant="dense"
          isRequired
          show={showRegularityModal}
          hide={hideRegularityModal}
          visible={visibleRegularityModal}
          testID="task-regularity-input"
        />
      </Stack>

      <Stack margin={{ top: 'md' }}>
        <HoliModalSelect
          options={DURATION_VALUES.map((value) => ({
            id: value,
            title: t(`spaces.input.task.section.timing.duration.value.${value}`),
            selected: value === duration,
          }))}
          label={t('spaces.input.task.section.timing.duration.label')}
          placeholder={t('spaces.input.task.section.timing.duration.placeholder')}
          title={t('spaces.input.task.section.timing.duration.modal.title')}
          description={t('spaces.input.task.section.timing.duration.modal.description')}
          onChange={({ id }) => {
            onDurationChange(id)
            return false
          }}
          modalFooter={
            <Button
              onPress={hideDurationModal}
              label={t('spaces.input.task.section.timing.duration.modal.saveButtonLabel')}
              testID="task-duration-input-save-button"
            />
          }
          variant="dense"
          isRequired
          show={showDurationModal}
          hide={hideDurationModal}
          visible={visibleDurationModal}
          testID="task-duration-input"
        />
      </Stack>
    </>
  )
}

export default TimingSection
