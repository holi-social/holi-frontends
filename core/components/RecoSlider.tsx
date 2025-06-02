import { Text, TextLink } from 'holi-bricks/components/text'
import type React from 'react'
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
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

type RecoSliderProps = {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem: ListRenderItem<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: readonly any[]
  icon: HoliIconType
  heading: string
  subline: string
  seeAllPath?: string
  onPressSeeMore?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  labelSeeMore?: string
  loading?: boolean
  testID?: string
  cardWidth: number
  viewTrackingParams?: TrackableFlatListParams
  size?: 'sm' | 'md'
  seeMoreTrackingEvent?: TrackingEvent
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
  cardWidth,
  viewTrackingParams,
  size = 'md',
  seeMoreTrackingEvent,
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { track } = useTracking()
  const { styles } = useStyles(stylesheet)

  const handleHeaderTitlePress = () => {
    if (seeAllPath) {
      if (seeMoreTrackingEvent) track(seeMoreTrackingEvent)
      navigate(seeAllPath)
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

  const listProps = {
    horizontal: true,
    contentContainerStyle: {
      paddingLeft: Spacing.xs,
      paddingRight: Spacing.xs,
      paddingBottom: Platform.OS === 'web' ? Spacing.xxs : undefined,
    },
    data,
    renderItem,
    ListFooterComponent:
      labelSeeMore && (seeAllPath || onPressSeeMore) ? (
        <View style={styles.seeMoreButton(cardWidth)}>
          <HoliMoreCard
            role="link"
            label={labelSeeMore}
            onPress={handleSeeMore}
            testID={`${name}-reco-slider-load-more-button`}
            size={size}
          >
            {labelSeeMore}
          </HoliMoreCard>
        </View>
      ) : (
        <></>
      ),
    testID: `${name}-reco-slider-list`,
  }

  const ListComponent = viewTrackingParams ? (
    <TrackableFlatList {...listProps} {...viewTrackingParams} />
  ) : (
    <FlatList {...listProps} />
  )

  return (
    <Stack gap="sm" minHeight="auto" flex={1} testID={testID || `${name}-reco-slider`}>
      <Stack onPress={handleHeaderTitlePress} testID={`${name}-reco-slider-heading-button`}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          padding={{ left: 'xs', right: 'xs' }}
          testID={`${name}-reco-slider-heading`}
        >
          <Stack direction="row" gap="xs" justifyContent="center" alignItems="center">
            <Stack
              elevation={200}
              borderRadius="lg"
              borderColor="muted"
              borderWidth="sm"
              backgroundColor="support"
              padding="xxs"
              justifyContent="center"
              alignItems="center"
            >
              <HoliIcon icon={icon} size={24} />
            </Stack>
            <Stack direction="column">
              <Text size="xxl" headingLevel="3">
                {heading}
              </Text>
              <Text size="sm" color="support">
                {subline}
              </Text>
            </Stack>
          </Stack>
          {seeAllPath && (
            <TextLink size="sm" role="none">
              {t('global.seeAll')}
            </TextLink>
          )}
        </Stack>
      </Stack>

      {ListComponent}
    </Stack>
  )
}

export default RecoSlider

const stylesheet = createStyleSheet(() => ({
  seeMoreButton: (cardWidth: number) => ({
    flex: 1,
    marginRight: Spacing.xxl,
    width: cardWidth,
  }),
}))
