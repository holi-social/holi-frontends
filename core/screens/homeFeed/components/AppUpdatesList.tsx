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
import tinycolor from 'tinycolor2'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import variables from '@holi/ui/styles/globalVars/variables'

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
  const cardImageSize = Platform.OS === 'web' ? 160 : screenWidth / 2 - 26

  const seeMore = () => {
    return loading ? (
      <View style={styles.loadingContainer}>
        <HoliIcon icon="loader-4" size={50} color={colors.fontColorGrey} spinning />
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
    <View style={style} testID={testID || 'app-updates-list'}>
      <View style={styles.header} testID={`${appName}-updates-heading`}>
        <View style={styles.iconContainer}>
          <HoliIcon icon={headingIcon} size={20} color={colors.fontColorGrey} />
        </View>
        <HoliHeading style={{ marginLeft: 12 }}>{heading}</HoliHeading>
      </View>
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
  },
  iconContainer: {
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tinycolor(colors.borderColorGrey).darken(5).toString(),
    backgroundColor: colors.backgroundColorGrey,
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
    paddingTop: Number(variables.topBarHeight) + 24,
    paddingBottom: 32,
  },
  loadingContainer: {
    width: 160,
    height: 160,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColorGrey,
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
    color: colors.secondaryColor,
    textAlign: 'center',
    marginTop: 16,
  },
})
