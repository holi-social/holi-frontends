import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, GestureResponderEvent, ListRenderItem, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'
import HoliText from '@holi/ui/components/atoms/HoliText'
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
}: RecoSliderProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme, cardWidth), [theme, cardWidth])

  const handleHeaderTitlePress = () => {
    seeAllPath && navigate(seeAllPath)
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
                <HoliHeading>{heading}</HoliHeading>
                <HoliText style={{ color: colors.foreground20 }}>{subline}</HoliText>
              </View>
            </View>
            {seeAllPath && <HoliText style={styles.seeAll}>{t('global.seeAll')}</HoliText>}
          </View>
        </HoliButton>
        <FlatList
          horizontal
          ListHeaderComponentStyle={styles.listHeader}
          style={styles.itemsContainer}
          data={data}
          renderItem={renderItem}
          ListFooterComponent={
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
            )
          }
          testID={`${name}-reco-slider-list`}
        />
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
    seeAll: {
      fontSize: 15,
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
