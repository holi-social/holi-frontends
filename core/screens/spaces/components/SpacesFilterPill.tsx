import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpacesFilterPillProps = {
  label: string
  filterType: 'generic' | 'topic' | 'skill' | 'location'
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const SpacesFilterPill: React.VFC<SpacesFilterPillProps> = ({
  label,
  filterType,
  onPress,
  style,
  testID = 'spaces-filter-pill',
}) => (
  <HoliButton
    label={label}
    style={style}
    contentStyle={[styles.buttonContent, styles[filterType]]}
    transparent
    inline
    onPress={onPress}
    testID={testID}
  >
    {filterType === 'location' && (
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_map_pin.svg')}
        width={13}
        height={18}
        label={''}
        isSvg
        style={styles.filterIcon}
      />
    )}
    <HoliText>{label}</HoliText>
  </HoliButton>
)

const styles = StyleSheet.create({
  generic: {
    backgroundColor: colors.backgroundColorWhite,
  },
  location: {
    backgroundColor: colors.backgroundColorWhite,
  },
  skill: {
    backgroundColor: colors.backgroundColorPillBlue,
  },
  topic: {
    backgroundColor: colors.backgroundColorPillGreen,
  },
  buttonContent: {
    borderColor: colors.borderColorBlack,
    borderRadius: 48,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterIcon: {
    marginRight: 4,
  },
})

export default SpacesFilterPill
