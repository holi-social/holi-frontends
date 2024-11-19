import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliCardComponent } from '@holi/ui/components/molecules/HoliCard'
import { useTheme } from '@holi/ui/styles/theme'

interface RecoSliderCardProps {
  name: string
  to: string | undefined
  imageSourceUri?: string
  title: string
  labels?: React.ReactNode
  footer?: string | React.ReactNode
  trackingEvent: TrackingEvent
  cardWidth: number
}

const RecoSliderCard = ({
  name,
  to,
  imageSourceUri,
  labels,
  title,
  footer,
  trackingEvent,
  cardWidth,
}: RecoSliderCardProps) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(cardWidth), [cardWidth])
  const testID = `${name}-reco-slider-card`

  if (!to) return null

  return (
    <View testID={testID} style={styles.container}>
      <HoliLinkTracked label={title} href={to} trackingEvent={trackingEvent} testID={`${testID}-link`} isFullHeight>
        <HoliCardComponent.CardContainer hasBorder borderColor="gray200" borderRadius={16}>
          <HoliCardComponent.ImageContainer testID={testID}>
            <HoliCardComponent.Image
              imageUri={imageSourceUri}
              imageWidth={cardWidth}
              imageAspectRatio={1.5}
              imageLabel={title}
              testID={testID}
            />
          </HoliCardComponent.ImageContainer>
          <HoliCardComponent.ContentContainer testID={testID}>
            {!!labels && labels}
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

export default RecoSliderCard

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
