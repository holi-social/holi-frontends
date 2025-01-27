import { ChipLabel } from 'holi-bricks/components/chips'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { getFormattedDateAbs } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { CalendarEventLine } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import HoliImage from '@holi/ui/components/atoms/HoliImage'

import { ChallengeEvent } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { Spacing } from 'holi-bricks/tokens'

export interface AttendingChallengeEventsCardProps {
  challengeEvent: ChallengeEvent
  testID?: string
}

const imageWidth = 86
const imageHeight = 86

const AttendingChallengeEventsCard = ({
  challengeEvent,
  testID = 'attending-challenge-card',
}: PropsWithChildren<AttendingChallengeEventsCardProps>) => {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const styles = getStyles(theme)

  const dates =
    getFormattedDateAbs(challengeEvent?.startDate, i18n.language) +
    ' - ' +
    getFormattedDateAbs(challengeEvent?.endDate, i18n.language)

  return (
    <HoliLink label={challengeEvent.title} href={createInAppChallengesPath(challengeEvent.link)}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <HoliImage
            testID={testID}
            source={{
              uri: challengeEvent.teaserImageUrl,
              width: imageWidth,
              height: imageHeight,
            }}
            style={[styles.image, { width: imageWidth, height: imageHeight }]}
            label={challengeEvent.title}
          />
        </View>

        <View style={styles.content}>
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
        </View>
      </View>
    </HoliLink>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      padding: Spacing.xs,
      alignItems: 'flex-start',
    },
    imageContainer: {
      marginRight: Spacing['3xs'],
    },
    image: {
      borderRadius: Spacing['4xs'],
    },
    content: {
      flex: 1,
      paddingVertical: Spacing['4xs'],
    },
  })

export default AttendingChallengeEventsCard
