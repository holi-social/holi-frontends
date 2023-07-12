import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type FilterType = 'generic' | 'topic' | 'skill' | 'location'

interface BaseProps {
  small?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

interface SkeletonProps extends BaseProps {
  loading: true
  label?: string
  filterType?: FilterType
}

interface Props extends BaseProps {
  loading?: false
  label: string
  filterType: FilterType
}

type SpacesFilterPillProps = SkeletonProps | Props

const BORDER_RADIUS = 48

const SpacesFilterPill: React.FC<SpacesFilterPillProps> = ({
  loading,
  label,
  filterType,
  onPress,
  style,
  small,
  testID = 'spaces-filter-pill',
}) => {
  const styles = getStyles(small || false)

  if (loading) {
    const paddingVertical = styles.buttonContent.paddingVertical
    return (
      <HoliText
        loading={true}
        size={small ? 'small' : undefined}
        numberOfLines={1}
        style={StyleSheet.flatten([styles.buttonContent, styles.loadingContent, style])}
        skeletonOptions={{ borderRadius: BORDER_RADIUS, width: '100%', paddingVertical }}
      />
    )
  }

  return (
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
      {small ? (
        <HoliText size="small" numberOfLines={1}>
          {label}
        </HoliText>
      ) : (
        <HoliText numberOfLines={1}>{label}</HoliText>
      )}
    </HoliButton>
  )
}

const getStyles = (small: boolean) =>
  StyleSheet.create({
    generic: {
      backgroundColor: colors.background10,
    },
    location: {
      backgroundColor: colors.background10,
    },
    skill: {
      backgroundColor: colors.brandColorD20,
    },
    topic: {
      backgroundColor: colors.brandColorC20,
    },
    buttonContent: {
      borderColor: colors.foreground30,
      borderRadius: BORDER_RADIUS,
      borderWidth: 1,
      paddingVertical: small ? 2 : 4,
      paddingHorizontal: small ? 8 : 10,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    loadingContent: {
      borderColor: 'transparent',
      paddingVertical: 0,
      paddingHorizontal: 0,
      width: 220,
    },
    filterIcon: {
      marginRight: 4,
    },
  })

export default SpacesFilterPill
