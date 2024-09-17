import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import FilterPill from '@holi/core/components/FilterPill'
import { HoliLinkTracked } from '@holi/core/navigation/components/HoliLinkTracked'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliCardComponent } from '@holi/ui/components/molecules/HoliCard'
import { useTheme } from '@holi/ui/styles/theme'

interface ActSliderItemProps {
  name: string
  to: string | undefined
  imageSourceUri?: string
  title: string
  topicLabel?: string
  topicLabelCount?: number
  skillLabel?: string
  skillLabelCount?: number
  footer?: string | React.ReactNode
  trackingEvent: TrackingEvent
  cardWidth: number
}

const ActSliderItem = ({
  to,
  imageSourceUri,
  topicLabel,
  topicLabelCount,
  skillLabel,
  skillLabelCount,
  title,
  footer,
  name,
  trackingEvent,
  cardWidth,
}: ActSliderItemProps) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(cardWidth), [cardWidth])

  if (!to) return null

  return (
    <View testID={`${name}-updates-item`} style={styles.container}>
      <HoliLinkTracked label={title} href={to} trackingEvent={trackingEvent}>
        <HoliCardComponent.CardContainer hasBorder borderColor="gray200" borderRadius={16}>
          <HoliCardComponent.ImageContainer>
            <HoliCardComponent.Image
              imageUri={imageSourceUri}
              imageWidth={cardWidth}
              imageAspectRatio={1.5}
              imageLabel={title}
            />
          </HoliCardComponent.ImageContainer>
          <HoliCardComponent.ContentContainer>
            {!!topicLabel && (
              <>
                <View style={styles.labelRow}>
                  <FilterPill small label={topicLabel} filterType="topic" style={styles.pill} />
                  {!!topicLabelCount && (
                    <FilterPill small label={'+' + topicLabelCount} filterType="topic" style={styles.pill} />
                  )}
                </View>
                <HoliGap size={'xxs'} />
              </>
            )}
            {!!skillLabel && (
              <>
                <View style={styles.labelRow}>
                  <FilterPill small label={skillLabel} filterType="skill" style={styles.pill} />
                  {!!skillLabelCount && (
                    <FilterPill small label={'+' + skillLabelCount} filterType="skill" style={styles.pill} />
                  )}
                </View>
                <HoliGap size={'xs'} />
              </>
            )}
            <>
              <View style={styles.content}>
                <HoliText size="small" bold numberOfLines={2} selectable>
                  {title}
                </HoliText>
              </View>
              <HoliGap size={'xs'} />
            </>
            {!!footer && (
              <>
                {typeof footer === 'string' ? (
                  <HoliText size="small" numberOfLines={2} selectable style={{ color: colors.gray300 }}>
                    {footer}
                  </HoliText>
                ) : (
                  footer
                )}
              </>
            )}
          </HoliCardComponent.ContentContainer>
        </HoliCardComponent.CardContainer>
      </HoliLinkTracked>
    </View>
  )
}

export default ActSliderItem

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    container: {
      width: cardWidth,
      marginRight: 12,
    },
    labelRow: {
      flexDirection: 'row',
      gap: 6,
    },
    pill: {
      flexShrink: 1,
    },
    content: {
      minHeight: 38,
      flex: 1,
      height: '100%',
      marginBottom: 6,
    },
  })
