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

export type TagSize = 's' | 'm'
const ICON_SIZES = { s: 24, m: 32 }
export type TagColor = 'default' | 'brandC200' | 'brandD200' | 'background20'
export type TagVariant = 'disabled' | 'default' | 'location'

const HORIZONTAL_SPACING = 10
const VERTICAL_SPACING = 8

const HoliTag = ({ children, color = 'default', size = 's', variant = 'default', hasBorder = true }: HoliTagProps) => {
  const { theme } = useTheme()

  const iconSize = ICON_SIZES[size]

  const styles = useMemo(() => {
    const options = {
      fontSize: size === 's' ? 12 : 16,
      iconOffset: iconSize / 3,
      isDisabled: variant === 'disabled',
      isLocation: variant === 'location',
      size,
      hasBorder,
    }

    return getStyles(theme, options)
  }, [size, iconSize, hasBorder, theme, variant])

  // const transformedChildren = typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children

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
      paddingVertical: VERTICAL_SPACING,
      paddingRight: HORIZONTAL_SPACING,
      paddingLeft: HORIZONTAL_SPACING + (options.isLocation ? options.iconOffset / 2 : 0),
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
      bottom: VERTICAL_SPACING,
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
