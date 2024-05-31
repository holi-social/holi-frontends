import type { PropsWithChildren } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getFormattedDateAbs } from '@holi/core/i18n/helpers/dateHelper'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { CalendarEventLine } from '@holi/icons/src/generated'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliTag from '@holi/ui/components/atoms/HoliTag'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { CardContainer } from '@holi/ui/components/molecules/HoliCard/CardContainer'
import { ContentContainer } from '@holi/ui/components/molecules/HoliCard/ContentContainer'
import { Image } from '@holi/ui/components/molecules/HoliCard/Image'
import { ImageContainer } from '@holi/ui/components/molecules/HoliCard/ImageContainer'
import { PropsWithSkeleton } from '@holi/ui/components/types'
import { useTheme } from '@holi/ui/styles/theme'

import { ChallengeEvent } from '@holi-apps/challenges/components/types'

export interface AttendingChallengeEventsCardProps {
  challengeEvent: ChallengeEvent
  testID?: string
}

const imageWidth = 86
const imageHeight = 86
const imageAspectRatio = 1

const AttendingChallengeEventsCard = ({
  challengeEvent,
  loading,
  testID = 'attending-challenge-card',
}: PropsWithChildren<PropsWithSkeleton<AttendingChallengeEventsCardProps>>) => {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()

  const imageBorderRadius = 4
  const containerProps = { borderRadius: imageBorderRadius, testID }
  const dates =
    getFormattedDateAbs(challengeEvent?.startDate, i18n.language) +
    ' - ' +
    getFormattedDateAbs(challengeEvent?.endDate, i18n.language)

  return (
    <CardContainer hasBorder testID={testID} extraBottomPadding={false}>
      <View style={styles.container}>
        <ImageContainer borderRadius={4} testID={testID} extraBottomMargin={false}>
          {loading ? (
            <HoliSkeleton
              width={imageWidth ?? 0}
              height={imageHeight ?? 0}
              aspectRatio={imageAspectRatio}
              borderRadius={imageBorderRadius}
            />
          ) : (
            <Image
              imageUrl={challengeEvent.teaserImageUrl}
              imageLabel="event teaser"
              imageHeight={imageHeight}
              imageWidth={imageWidth}
              imageAspectRatio={imageAspectRatio}
              borderRadius={imageBorderRadius}
              testID={testID}
            />
          )}
        </ImageContainer>

        <ContentContainer {...containerProps}>
          <HoliTag size="s" hasBorder={false} color="background20">
            <View style={styles.container}>
              <HoliIcon icon={CalendarEventLine} color={theme.colors.foreground30} size={14} />
              <HoliText size="small">{t('challenges:attending.title')}</HoliText>
            </View>
          </HoliTag>
          <HoliText size="small">{challengeEvent?.title}</HoliText>
          <HoliText size="small">{dates}</HoliText>
        </ContentContainer>
      </View>
    </CardContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
})

export default AttendingChallengeEventsCard
