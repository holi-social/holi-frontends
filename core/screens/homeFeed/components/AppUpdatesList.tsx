import React from 'react'
import { FlatList, GestureResponderEvent, ListRenderItem, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SeeMore from '@holi/core/screens/homeFeed/components/SeeMore'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

type AppUpdatesListProps = {
  appName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem: ListRenderItem<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  heading: string
  headingIcon: string
  onPressSeeMore: (event: React.SyntheticEvent | GestureResponderEvent) => void
  labelSeeMore: string
  loading?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

const AppUpdatesList: React.VFC<AppUpdatesListProps> = ({
  appName,
  renderItem,
  data,
  heading,
  headingIcon,
  onPressSeeMore,
  labelSeeMore,
  loading,
  style,
  testID,
}: AppUpdatesListProps) => {
  const { navigate } = useRouting()

  const handleHeaderTitlePress = () => {
    const navigationPath = HOLI_APPS_NAVIGATION_PATHS[appName].path
    navigate(navigationPath)
  }

  return (
    <View style={style} testID={testID || `${appName}-app-updates-list`}>
      <HoliButton inline label={heading} style={styles.headerContainer} transparent onPress={handleHeaderTitlePress}>
        <View style={styles.header} testID={`${appName}-updates-heading`}>
          <View style={styles.iconContainer}>
            <HoliIcon icon={headingIcon} size={20} color={colors.foreground20} />
          </View>
          <View>
            <HoliHeading style={{ marginLeft: 12 }}>{heading}</HoliHeading>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  headerContainer: { alignSelf: 'flex-start' },
  iconContainer: {
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.foreground10,
    backgroundColor: colors.background20,
  },
  itemsContainer: {
    paddingVertical: 24,
    marginHorizontal: -20,
    paddingLeft: 24,
  },
  seeMoreButton: {
    marginRight: 11,
  },
  listHeader: {
    paddingTop: vars.topBarHeight + 24,
    paddingBottom: 32,
  },
})
