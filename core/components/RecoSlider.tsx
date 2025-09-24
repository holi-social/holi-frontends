import { Text, TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, type GestureResponderEvent, type ListRenderItem, Platform, View } from 'react-native'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { TrackableFlatListParams } from '@holi/core/tracking/TrackableFlatList.shared'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'
import type { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Stack } from 'holi-bricks/components/stack'
import { Spacing } from 'holi-bricks/foundations'
import { ArrowRightS } from '@holi/icons/src/generated'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

const ICON_SIZE = 20

type RecoSliderProps = {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem: ListRenderItem<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: readonly any[]
  icon?: HoliIconType
  heading: string
  subline?: string
  seeAllPath?: string
  onPressSeeMore?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  labelSeeMore?: string
  loading?: boolean
  testID?: string
  viewTrackingParams?: TrackableFlatListParams
  size?: 'sm' | 'md'
  seeMoreTrackingEvent?: TrackingEvent
  headerTitleSeeMoreTrackingEvent?: TrackingEvent
  headerTitleTrackingEvent?: TrackingEvent
}

const RecoSlider: React.FC<RecoSliderProps> = ({
  name,
  renderItem,
  data,
  icon,
  heading,
  subline,
  seeAllPath,
  onPressSeeMore,
  labelSeeMore,
  loading,
  testID,
  viewTrackingParams,
  seeMoreTrackingEvent,
  headerTitleSeeMoreTrackingEvent,
  headerTitleTrackingEvent,
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { track } = useTracking()
  const [itemsWidth, setItemsWidth] = useState<number | null>(null)
  const { styles } = useStyles(stylesheet)

  const handleHeaderTitlePress = () => {
    if (seeAllPath) {
      if (headerTitleTrackingEvent) track(headerTitleTrackingEvent)
      navigate(seeAllPath)
    }
  }

  const handleSeeMoreHeaderTitlePress = (event: React.SyntheticEvent | GestureResponderEvent) => {
    if (seeAllPath) {
      if (headerTitleSeeMoreTrackingEvent) track(headerTitleSeeMoreTrackingEvent)
      navigate(seeAllPath)
    } else if (onPressSeeMore) {
      onPressSeeMore(event)
    }
  }

  const handleSeeMore = (event: React.SyntheticEvent | GestureResponderEvent) => {
    if (seeMoreTrackingEvent) track(seeMoreTrackingEvent)
    if (onPressSeeMore) {
      onPressSeeMore(event)
    } else if (seeAllPath) {
      navigate(seeAllPath)
    }
  }

  if (loading) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderItemWithMeasurement = (info: any) => {
    const originalItem = renderItem(info)

    // Measure the first few items to get consistent dimensions
    const shouldMeasure = !itemsWidth && info.index < 3

    if (shouldMeasure) {
      return (
        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout
            setItemsWidth(width)
          }}
        >
          {originalItem}
        </View>
      )
    }

    return originalItem
  }

  const listProps = {
    horizontal: true,
    contentContainerStyle: {
      paddingBottom: Platform.OS === 'web' ? Spacing.xxs : undefined,
      gap: Spacing['3xs'],
    },
    data,
    renderItem: renderItemWithMeasurement,
    ListFooterComponent:
      labelSeeMore && (seeAllPath || onPressSeeMore) ? (
        <View style={styles.seeMoreButton(itemsWidth || 0)}>
          <HoliMoreCard
            role="link"
            label={labelSeeMore}
            onPress={handleSeeMore}
            testID={`${name}-reco-slider-load-more-button`}
          >
            {labelSeeMore}
          </HoliMoreCard>
        </View>
      ) : null,
    testID: `${name}-reco-slider-list`,
  }

  const ListComponent = viewTrackingParams ? (
    <TrackableFlatList {...listProps} {...viewTrackingParams} />
  ) : (
    <FlatList {...listProps} />
  )

  return (
    <Stack gap="xxs" minHeight="auto" flex={1} testID={testID || `${name}-reco-slider`}>
      <Stack onPress={handleHeaderTitlePress} testID={`${name}-reco-slider-heading-button`}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={'xs'}
          flex={1}
          testID={`${name}-reco-slider-heading`}
        >
          <Stack width={'100%'} direction="row" gap="xxs" justifyContent="center" alignItems="flex-start">
            {icon && (
              <Stack justifyContent="center" alignItems="center">
                <HoliIcon icon={icon} size={ICON_SIZE} color="support" />
              </Stack>
            )}

            <Stack direction="column" flex={1}>
              <Text size="xl" headingLevel="3">
                {heading}
              </Text>
            </Stack>

            {(seeAllPath || onPressSeeMore) && (
              <Stack direction="row">
                <TextLink size="sm" role="none" onPress={handleSeeMoreHeaderTitlePress}>
                  {t('global.seeMore')}
                </TextLink>
                <HoliIcon icon={ArrowRightS} size={ICON_SIZE} />
              </Stack>
            )}
          </Stack>
        </Stack>

        {subline && (
          <Stack direction="row" padding={{ left: 'lg' }}>
            <Text size="sm" color="support">
              {subline}
            </Text>
          </Stack>
        )}
      </Stack>

      {ListComponent}
    </Stack>
  )
}

export default RecoSlider

const stylesheet = createStyleSheet(() => ({
  seeMoreButton: (cardWidth: number) => ({
    flex: 1,
    width: cardWidth,
  }),
}))
