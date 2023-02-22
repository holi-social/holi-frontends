import React from 'react'
import {
  FlatList,
  GestureResponderEvent,
  ListRenderItem,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import { HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
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
  const { width: screenWidth } = useWindowDimensions()
  const { navigate } = useRouting()
  const cardImageSize = Platform.OS === 'web' ? 160 : screenWidth / 2 - 26

  const handleHeaderTitlePress = () => {
    const navigationPath = HOLI_APPS_NAVIGATION_PATHS[appName].path
    navigate(navigationPath)
  }

  const seeMore = () => {
    return loading && Platform.OS !== 'web' ? (
      <View style={styles.loadingContainer}>
        <HoliIcon icon="loader-4" size={50} color={colors.foreground20} spinning />
      </View>
    ) : (
      <HoliButton
        label={labelSeeMore}
        style={[styles.buttonContainer, styles.lastButtonContainer]}
        onPress={onPressSeeMore}
        transparent
        inline
        testID={`${appName}-updates-load-more-button`}
      >
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_see_more.png')}
          width={cardImageSize}
          height={cardImageSize}
          label=""
        />
        <View style={styles.seeMoreContainer}>
          <HoliText style={styles.seeMoreText} size="small" bold>
            {labelSeeMore}
          </HoliText>
        </View>
      </HoliButton>
    )
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
        ListFooterComponent={seeMore}
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
  listingItem: {
    height: 'auto',
    width: 160,
  },
  itemsContainer: {
    paddingVertical: 24,
    marginHorizontal: -20,
    paddingLeft: 24,
  },
  buttonContainer: {
    marginRight: 11,
  },
  listHeader: {
    paddingTop: vars.topBarHeight + 24,
    paddingBottom: 32,
  },
  loadingContainer: {
    width: 160,
    height: 160,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background20,
  },
  lastButtonContainer: {
    marginRight: Platform.OS === 'web' ? 24 : 48,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  seeMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seeMoreText: {
    color: colors.brandColorB30,
    textAlign: 'center',
    marginTop: 16,
  },
})
