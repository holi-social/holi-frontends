import { Text, TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, type ListRenderItem, Pressable, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { TrackableFlatListParams } from '@holi/core/tracking/TrackableFlatList.shared'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Challenges } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import ExploreMoreCard from '@holi-apps/challenges/components/feed/ExploreMoreCard'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import type { ChallengeTeaser } from '@holi-apps/challenges/components/types'
import { Spacing } from 'holi-bricks/foundations/dimensions/spacing'

type ChallengesSliderProps = {
  heading: string
  subline: string
  challenges: readonly ChallengeTeaser[]
  renderItem: ListRenderItem<ChallengeTeaser>
  seeAllPath?: string
  labelSeeMore?: string
  cardWidth?: number
  testID?: string
  viewTrackingParams?: TrackableFlatListParams
}

const ChallengesSlider: React.FC<ChallengesSliderProps> = ({
  heading,
  subline,
  challenges,
  renderItem,
  seeAllPath,
  labelSeeMore,
  cardWidth = 130,
  testID,
  viewTrackingParams,
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme, cardWidth), [theme, cardWidth])

  const handleHeaderTitlePress = () => {
    if (seeAllPath) {
      navigate(seeAllPath)
    }
  }

  const listProps = {
    horizontal: true,
    style: styles.itemsContainer,
    data: challenges,
    renderItem,
    testID: 'challenges-slider-list',
    ListFooterComponent:
      labelSeeMore && seeAllPath ? (
        <View style={styles.seeMoreButton}>
          <ExploreMoreCard
            role="link"
            label={labelSeeMore}
            onPress={handleHeaderTitlePress}
            testID="challenges-slider-load-more-button"
          >
            {labelSeeMore}
          </ExploreMoreCard>
        </View>
      ) : null,
  }

  const ListComponent = viewTrackingParams ? (
    <TrackableFlatList {...listProps} {...viewTrackingParams} />
  ) : (
    <FlatList {...listProps} />
  )

  return (
    <HoliContainer noPadding>
      <View style={styles.container} testID={testID || 'challenges-slider'}>
        <Pressable style={styles.header} testID="challenges-slider-heading" onPress={handleHeaderTitlePress}>
          <View style={styles.headerTitle}>
            <HoliIcon icon={Challenges} size={20} colorOverride={colors.black300} />
            <View style={{ gap: 2 }}>
              <Text size="xl" headingLevel="3">
                {heading}
              </Text>
              <Text size="sm" color="support" numberOfLines={1}>
                {subline}
              </Text>
            </View>
          </View>
          {seeAllPath && (
            <View style={styles.seeAllButton}>
              <TextLink size="sm" role="none">
                {t('global.seeAll')}
              </TextLink>
            </View>
          )}
        </Pressable>
        {ListComponent}
      </View>
    </HoliContainer>
  )
}

export default ChallengesSlider

const getStyles = (theme: HoliTheme, cardWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 'auto',
    },
    header: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      gap: Spacing.xxs,
      width: '100%',
      justifyContent: 'space-between',
    },
    headerTitle: {
      flexDirection: 'row',
      gap: Spacing['3xs'],
      maxWidth: '75%',
    },
    itemsContainer: {
      paddingBottom: 0,
      marginHorizontal: -Spacing.sm,
      paddingLeft: 18,
      flex: 1,
    },
    seeMoreButton: {
      flex: 1,
      marginRight: 44,
      width: cardWidth,
    },
    seeAllButton: {
      position: 'absolute',
      right: 0,
    },
  })
