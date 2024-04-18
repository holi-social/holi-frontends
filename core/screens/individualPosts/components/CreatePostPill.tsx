import React, { useMemo } from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type FilterType = 'generic' | 'visibility' | 'topic' | 'category'

interface BaseProps {
  label: string
  filterType: FilterType
  small?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

interface SkeletonProps extends Partial<BaseProps> {
  loading: true
}

interface Props extends BaseProps {
  loading?: false
}

type CreatePostPillProps = SkeletonProps | Props

const BORDER_RADIUS = 48

const SpacesFilterPill: React.FC<CreatePostPillProps> = ({
  loading,
  label,
  filterType,
  onPress,
  style,
  small,
  testID = 'spaces-filter-pill',
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(small || false, theme), [theme, small])

  if (loading) {
    const paddingVertical = styles.buttonContent.paddingVertical
    return (
      <HoliText
        loading={true}
        size={small ? 'small' : undefined}
        numberOfLines={1}
        style={StyleSheet.flatten([styles.buttonContent, styles.loadingContent, style])}
        skeletonOptions={{ borderRadius: BORDER_RADIUS, width: '100%', paddingVertical }}
        testID={testID + '-loading'}
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
      {filterType === 'visibility' && (
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_map_pin.svg')}
          width={14}
          height={19}
          label={''}
          isSvg
          style={styles.filterIcon}
        />
      )}
      {small ? (
        <HoliText size={filterType === 'topic' ? 'extrasmall' : 'small'} numberOfLines={1}>
          {label}
        </HoliText>
      ) : (
        <HoliText numberOfLines={1}>{label}</HoliText>
      )}
    </HoliButton>
  )
}
const getStyles = (small: boolean, theme: HoliTheme) =>
  StyleSheet.create({
    generic: {
      backgroundColor: theme.colors.background10,
    },
    visibility: {
      backgroundColor: theme.colors.background10,
    },
    topic: {
      backgroundColor: theme.colors.brandColorC20,
    },
    category: {
      backgroundColor: theme.colors.brandColorA20,
    },
    buttonContent: {
      borderColor: theme.colors.foreground30,
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
      marginRight: 6,
    },
  })

export default SpacesFilterPill
