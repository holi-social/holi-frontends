import React, { useMemo } from 'react'
import { type StyleProp, StyleSheet, View, type ViewStyle, type TextStyle } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

type FilterType = 'generic' | 'topic' | 'skill' | 'location' | 'planned'

// Pill props
export interface BasePillProps {
  label: string
  filterType: FilterType
  small?: boolean
  style?: StyleProp<ViewStyle>
}

const BORDER_RADIUS = 48

export const FilterPill = ({ loading, label, filterType, style, small }: PropsWithSkeleton<BasePillProps>) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(small || false, theme), [theme, small])

  if (loading) {
    const paddingVertical = styles.buttonContent.paddingVertical
    return (
      <HoliText
        loading={true}
        size={small ? 'small' : undefined}
        numberOfLines={1}
        style={StyleSheet.flatten([styles.buttonContent, styles.loadingContent, style]) as StyleProp<TextStyle>}
        skeletonOptions={{ borderRadius: BORDER_RADIUS, width: '100%', paddingVertical }}
      />
    )
  }

  return (
    <View style={[styles.buttonContent, styles[filterType], style]}>
      {filterType === 'location' && (
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
        <HoliText size={filterType === 'planned' ? 'extrasmall' : 'small'} numberOfLines={1}>
          {label}
        </HoliText>
      ) : (
        <HoliText numberOfLines={1} color={theme.dark && filterType !== 'location' ? 'white100' : 'black300'}>
          {label}
        </HoliText>
      )}
    </View>
  )
}

const getStyles = (small: boolean, theme: HoliTheme) =>
  StyleSheet.create({
    generic: {
      backgroundColor: theme.colors.background10,
    },
    location: {
      backgroundColor: theme.colors.background10,
    },
    skill: {
      backgroundColor: theme.colors.brandColorD20,
    },
    topic: {
      backgroundColor: theme.colors.brandColorC20,
    },
    planned: {
      backgroundColor: theme.dark ? theme.colors.background10 : theme.colors.brandColorD10,
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
