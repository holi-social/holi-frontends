import type React from 'react'
import { useTranslation } from 'react-i18next'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRight } from '@holi/icons/src/generated'
import { useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { Spacing } from 'holi-bricks/foundations'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'
import HoliDatePicker from '@holi/ui/components/organisms/HoliDatePicker'

import type { UseTimeFrameReturnValue } from './useTimeFrame'
import { getOneDayLaterDate, getTodayDate } from './dateHelpers'

const TimeFrameSection = ({
  timeFrame,
  onChangeAnytimeToggle,
  onChangeStart,
  onChangeEnd,
}: UseTimeFrameReturnValue) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <>
      <Stack margin={{ bottom: 'xs' }}>
        <Text size="xxl">{t('spaces.input.task.section.timeFrame')}</Text>
      </Stack>

      <Stack direction="row" gap="md" justifyContent="space-between" margin={{ top: 'xxs' }}>
        <Text size="md">{t('spaces.input.task.section.timeFrame.anytime.label')}</Text>
        <HoliSwitch value={timeFrame.anytime} size="small" onChange={onChangeAnytimeToggle} />
      </Stack>

      <Stack shouldRender={!timeFrame.anytime} direction="row" gap="xs" margin={{ top: 'xs' }}>
        <Stack flex={1}>
          <HoliDatePicker
            isRequired
            title={t('spaces.input.task.section.timeFrame.start.label')}
            label={t('spaces.input.task.section.timeFrame.start.label')}
            dateFormat="short"
            value={timeFrame.start}
            onChange={onChangeStart}
            minimumDate={getTodayDate()}
          />
        </Stack>

        <Stack margin={{ top: 'xl' }}>
          <HoliIcon icon={ArrowRight} size={Spacing.md} colorOverride={colors.foreground30} />
        </Stack>

        <Stack flex={1}>
          <HoliDatePicker
            isRequired
            title={t('spaces.input.task.section.timeFrame.end.label')}
            label={t('spaces.input.task.section.timeFrame.end.label')}
            dateFormat="short"
            value={timeFrame.end}
            onChange={onChangeEnd}
            minimumDate={getOneDayLaterDate(getTodayDate())}
          />
        </Stack>
      </Stack>
    </>
  )
}

export default TimeFrameSection
