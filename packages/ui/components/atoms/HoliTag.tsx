import React, { ReactNode, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import HoliLocalImage from './HoliLocalImage'

export interface HoliTagProps {
  size: TagSize
  children: ReactNode
  color?: TagColor
  variant?: TagVariant
  hasBorder?: boolean
}

export type TagSize = 'xs' | 's' | 'm'
const ICON_SIZES = { xs: 14, s: 24, m: 32 }
export type TagColor = 'default' | 'brandC200' | 'brandD200' | 'background20'
export type TagVariant = 'disabled' | 'default' | 'location' | 'date'

const HORIZONTAL_SPACING = { xs: 8, s: 10, m: 10 }
const VERTICAL_SPACING = { xs: 4, s: 8, m: 8 }

const HoliTag = ({ children, color = 'default', size = 's', variant = 'default', hasBorder = true }: HoliTagProps) => {
  const { theme } = useTheme()

  const iconSize = ICON_SIZES[size]

  const styles = useMemo(() => {
    const options = {
      fontSize: size === 'm' ? 16 : 12,
      iconOffset: iconSize / 3,
      isDisabled: variant === 'disabled',
      isLocation: variant === 'location',
      size,
      hasBorder,
    }

    return getStyles(theme, options)
  }, [size, iconSize, hasBorder, theme, variant])

  return (
    <View style={[styles.container, styles[color]]}>
      {variant === 'location' && (
        <View style={styles.icon}>
          <HoliLocalImage
            label="more"
            imageSource={require('@holi/ui/assets/img/icons/brand/pin.svg')}
            isSvg
            width={iconSize}
            height={iconSize}
          />
        </View>
      )}
      {typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children}
    </View>
  )
}

export default HoliTag

interface StyleOptions {
  fontSize: number
  iconOffset: number
  isDisabled: boolean
  isLocation: boolean
  size: TagSize
  hasBorder: boolean
}

const getStyles = (theme: HoliTheme, options: StyleOptions) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      flexGrow: 0,
      borderRadius: options.size == 's' ? 40 : 48,
      paddingVertical: VERTICAL_SPACING[options.size],
      paddingRight: HORIZONTAL_SPACING[options.size],
      paddingLeft: HORIZONTAL_SPACING[options.size] + (options.isLocation ? options.iconOffset / 2 : 0),
      borderWidth: options.hasBorder ? 1 : 0,
      borderStyle: 'solid',
      borderColor: options.isDisabled ? theme.colors.gray200 : theme.colors.black300,
    },
    text: {
      fontSize: options.fontSize,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: options.isDisabled ? theme.colors.gray200 : theme.colors.black300,
    },
    icon: {
      position: 'absolute',
      bottom: VERTICAL_SPACING['m'],
      left: -options.iconOffset,
    },
    default: {
      backgroundColor: options.isDisabled ? theme.colors.white200 : theme.colors.white100,
    },
    brandC200: {
      backgroundColor: options.isDisabled ? theme.colors.white100 : theme.colors.brandC200,
    },
    brandD200: {
      backgroundColor: options.isDisabled ? theme.colors.white100 : theme.colors.brandD200,
    },
    background20: {
      backgroundColor: options.isDisabled ? theme.colors.white100 : theme.colors.background20,
    },
  })
