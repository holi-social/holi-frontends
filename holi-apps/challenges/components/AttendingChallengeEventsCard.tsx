import type { PropsWithChildren } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { getFormattedDateAbs } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { CalendarEventLine } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import ChipLabel from '@holi/ui/no-name/components/chips/ChipLabel'

import { ChallengeEvent } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'

export interface AttendingChallengeEventsCardProps {
  challengeEvent: ChallengeEvent
  testID?: string
}

const imageWidth = 86
const imageHeight = 86
const imageAspectRatio = 1

const AttendingChallengeEventsCard = ({
  challengeEvent,
  testID = 'attending-challenge-card',
}: PropsWithChildren<AttendingChallengeEventsCardProps>) => {
  const { t, i18n } = useTranslation()

  const dates =
    getFormattedDateAbs(challengeEvent?.startDate, i18n.language) +
    ' - ' +
    getFormattedDateAbs(challengeEvent?.endDate, i18n.language)

  return (
    <HoliLink label={challengeEvent.title} href={createInAppChallengesPath(challengeEvent.link)}>
      <HoliCard
        hasBorder
        testID={testID}
        direction="horizontal"
        borderRadius={8}
        imageUri={challengeEvent.teaserImageUrl}
        imageLabel={challengeEvent.title}
        imageHeight={imageHeight}
        imageWidth={imageWidth}
        imageAspectRatio={imageAspectRatio}
        imageBorderRadius={4}
      >
        <ChipLabel iconLeading={CalendarEventLine} size="sm">
          {t('challenges:attending.title')}
        </ChipLabel>
        <HoliGap size="xs" />
        <HoliText size="small" bold>
          {challengeEvent?.title}
        </HoliText>
        <HoliGap size="xs" />
        <HoliText size="extrasmall" color="gray300">
          {dates}
        </HoliText>
      </HoliCard>
    </HoliLink>
  )
}

export default AttendingChallengeEventsCard
