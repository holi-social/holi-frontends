import { Text, TextLink } from 'holi-bricks/components/text'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, GestureResponderEvent, ListRenderItem, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import { TrackableFlatListParams } from '@holi/core/tracking/TrackableFlatList.shared'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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

  const handleSeeMore = (event: React.SyntheticEvent | GestureResponderEvent) => {
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
    ListHeaderComponentStyle: styles.listHeader,
    style: styles.itemsContainer,
    data,
    renderItem,
    ListFooterComponent:
      labelSeeMore && (seeAllPath || onPressSeeMore) ? (
        <View style={styles.seeMoreButton}>
          <HoliMoreCard
            role="link"
            label={labelSeeMore}
            onPress={handleSeeMore}
            testID={`${name}-reco-slider-load-more-button`}
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
    <HoliContainer>
      <View style={styles.container} testID={testID || `${name}-reco-slider`}>
        <HoliButton
          inline
          label={heading}
          style={styles.headerContainer}
          transparent
          onPress={handleHeaderTitlePress}
          testID={`${name}-reco-slider-heading-button`}
        >
          <View style={styles.header} testID={`${name}-reco-slider-heading`}>
            <View style={styles.headerTitle}>
              <View style={styles.iconContainer}>
                <HoliIcon icon={icon} size={20} color={colors.black300} />
              </View>
              <View style={{ gap: 4 }}>
                <Text size="xxl" headingLevel="3">
                  {heading}
                </Text>
                <Text size="sm" variant="secondary">
                  {subline}
                </Text>
              </View>
            </View>
            {seeAllPath && <TextLink size="sm">{t('global.seeAll')}</TextLink>}
          </View>
        </HoliButton>

        {ListComponent}
      </View>
    </HoliContainer>
  )
}
export default RecoSlider

const getStyles = (theme: HoliTheme, cardWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 'auto',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 12,
      width: '100%',
      justifyContent: 'space-between',
    },
    headerTitle: {
      flexDirection: 'row',
      gap: 12,
    },
    headerContainer: {
      alignSelf: 'flex-start',
      paddingBottom: 24,
      width: '100%',
    },
    iconContainer: {
      padding: 13,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      backgroundColor: theme.colors.background10,
    },
    itemsContainer: {
      paddingBottom: 0,
      marginHorizontal: -20,
      paddingLeft: 24,
      flex: 1,
    },
    seeMoreButton: {
      flex: 1,
      marginRight: 44,
      width: cardWidth,
    },
    listHeader: {
      paddingTop: dimensions.topBarHeight + 24,
      paddingBottom: 32,
    },
  })
