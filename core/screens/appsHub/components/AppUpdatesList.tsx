import React, { useMemo } from 'react'
import { FlatList, GestureResponderEvent, ListRenderItem, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SeeMore from '@holi/core/screens/homeFeed/components/SeeMore'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type AppUpdatesListProps = {
  appName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem: ListRenderItem<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  appIcon: HoliIconType
  heading: string
  subline: string
  onPressSeeMore: (event: React.SyntheticEvent | GestureResponderEvent) => void
  labelSeeMore: string
  loading?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

const AppUpdatesList: React.FC<AppUpdatesListProps> = ({
  appName,
  renderItem,
  data,
  appIcon,
  heading,
  subline,
  onPressSeeMore,
  labelSeeMore,
  loading,
  style,
  testID,
}: AppUpdatesListProps) => {
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

  const handleHeaderTitlePress = () => {
    const navigationPath = HOLI_APPS_NAVIGATION_PATHS[appName].path
    navigate(navigationPath)
  }

  return (
    <View style={style} testID={testID || `${appName}-app-updates-list`}>
      <HoliButton inline label={heading} style={styles.headerContainer} transparent onPress={handleHeaderTitlePress}>
        <View style={styles.header} testID={`${appName}-updates-heading`}>
          <View style={styles.iconContainer}>
            <HoliIcon icon={appIcon} size={20} color={colors.foreground20} />
          </View>
          <View style={{ gap: 4 }}>
            <HoliHeading>{heading}</HoliHeading>
            <HoliText style={{ color: colors.foreground20 }}>{subline}</HoliText>
          </View>
        </View>
      </HoliButton>
      <FlatList
        horizontal
        ListHeaderComponentStyle={styles.listHeader}
        style={styles.itemsContainer}
        data={data}
        renderItem={renderItem}
        ListFooterComponent={
          <SeeMore
            label={labelSeeMore}
            loading={loading}
            onPress={onPressSeeMore}
            style={styles.seeMoreButton}
            testID={`${appName}-updates-load-more-button`}
          />
        }
        testID={`${appName}-updates-container`}
      />
    </View>
  )
}
export default AppUpdatesList

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 12,
    },
    headerContainer: {
      alignSelf: 'flex-start',
      paddingBottom: 24,
    },
    iconContainer: {
      padding: 13,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      backgroundColor: theme.colors.background20,
    },
    itemsContainer: {
      paddingBottom: 12,
      marginHorizontal: -20,
      paddingLeft: 24,
    },
    seeMoreButton: {
      marginRight: 11,
    },
    listHeader: {
      paddingTop: dimensions.topBarHeight + 24,
      paddingBottom: 32,
    },
  })
