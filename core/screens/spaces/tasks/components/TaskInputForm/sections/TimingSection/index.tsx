import type React from 'react'
import { useTranslation } from 'react-i18next'

import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import HoliModalSelect from '@holi/ui/components/organisms/HoliModalSelect'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Button } from 'holi-bricks/components/button'
import { Duration, Regularity } from '@holi/api/graphql/graphql-codegen'
import type { TaskFormInput } from '@holi/core/screens/spaces/tasks/components/TaskInputForm/types'
import type { TranslatedFieldErrors } from '@holi/core/errors/hooks'

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

type TimingState = Partial<Pick<TaskFormInput, 'regularity' | 'duration'>>

interface TimingSection extends Partial<Pick<TaskFormInput, 'regularity' | 'duration'>> {
  onChange: (update: TimingState) => void
  validateField: (field: keyof TimingState) => void
  fieldErrors?: TranslatedFieldErrors
}

const TimingSection = ({ regularity, duration, onChange, validateField, fieldErrors = {} }: TimingSection) => {
  const { t } = useTranslation()

  const {
    show: showRegularityModal,
    visible: visibleRegularityModal,
    props: { onDismiss: hideRegularityModal },
  } = useModalState({ onDismiss: () => validateField('regularity') })
  const {
    show: showDurationModal,
    visible: visibleDurationModal,
    props: { onDismiss: hideDurationModal },
  } = useModalState({ onDismiss: () => validateField('duration') })

  return (
    <>
      <Stack margin={{ bottom: 'xs' }}>
        <Text size="xxl">{t('spaces.input.task.section.timing')}</Text>
      </Stack>

      <Stack margin={{ top: 'xxs' }}>
        <HoliModalSelect
          selected={regularity}
          options={REGULARITY_VALUES.map((value) => ({
            id: value,
            title: t(`spaces.input.task.section.timing.regularity.value.${value}`),
          }))}
          label={t('spaces.input.task.section.timing.regularity.label')}
          placeholder={t('spaces.input.task.section.timing.regularity.placeholder')}
          title={t('spaces.input.task.section.timing.regularity.modal.title')}
          description={t('spaces.input.task.section.timing.regularity.modal.description')}
          onChange={({ id: regularity }) => {
            onChange({ regularity })
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
          validationErrorText={fieldErrors.regularity?.[0]}
          testID="task-regularity-input"
        />
      </Stack>

      <Stack margin={{ top: 'md' }}>
        <HoliModalSelect
          selected={duration}
          options={DURATION_VALUES.map((value) => ({
            id: value,
            title: t(`spaces.input.task.section.timing.duration.value.${value}`),
          }))}
          label={t('spaces.input.task.section.timing.duration.label')}
          placeholder={t('spaces.input.task.section.timing.duration.placeholder')}
          title={t('spaces.input.task.section.timing.duration.modal.title')}
          description={t('spaces.input.task.section.timing.duration.modal.description')}
          onChange={({ id: duration }) => {
            onChange({ duration })
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
          validationErrorText={fieldErrors.duration?.[0]}
          testID="task-duration-input"
        />
      </Stack>
    </>
  )
}

export default TimingSection
