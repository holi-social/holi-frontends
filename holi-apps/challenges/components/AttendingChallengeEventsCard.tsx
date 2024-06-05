import type { PropsWithChildren } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getFormattedDateAbs } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { CalendarEventLine } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliTag from '@holi/ui/components/atoms/HoliTag'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

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
  const { theme } = useTheme()

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
        imageUrl={challengeEvent.teaserImageUrl}
        imageLabel={challengeEvent.title}
        imageHeight={imageHeight}
        imageWidth={imageWidth}
        imageAspectRatio={imageAspectRatio}
        imageBorderRadius={4}
      >
        <HoliTag size="xs" hasBorder={false} variant="disabled">
          <View style={styles.tag}>
            <HoliIcon icon={CalendarEventLine} color={theme.colors.gray300} size={14} />
            <HoliText size="extrasmall" color="gray300">
              {t('challenges:attending.title')}
            </HoliText>
          </View>
        </HoliTag>
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

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    gap: dimensions.spacingXxs,
    alignItems: 'center',
  },
})

export default AttendingChallengeEventsCard
