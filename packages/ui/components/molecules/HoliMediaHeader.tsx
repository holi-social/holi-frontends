import React, { useMemo } from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar, { type AvatarProps } from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { PropsWithSkeleton } from '@holi/ui/components/types'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props {
  avatarProps: AvatarProps
  title: string
  titleLabel: string
  titleBold?: boolean
  date?: string
  onAvatarPressed?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  onTitlePressed?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  style?: StyleProp<ViewStyle>
  testID?: string
}

export type HoliMediaHeaderProps = PropsWithSkeleton<Props>

const HoliMediaHeader = ({
  loading,
  title,
  titleLabel,
  titleBold,
  avatarProps,
  date,
  onAvatarPressed,
  onTitlePressed,
  style,
  testID,
}: HoliMediaHeaderProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  if (loading) {
    return (
      <View style={[styles.row, style]} testID={testID}>
        <HoliAvatar {...avatarProps} size={avatarProps?.size || 'small'} loading label={''} />

        <View style={[styles.titleContainer]}>
          <HoliText loading />
          <HoliText size="small" style={styles.date} loading />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.row, style]} testID={testID}>
      <HoliButton inline transparent label={avatarProps.label} onPress={onAvatarPressed}>
        <HoliAvatar {...avatarProps} size={avatarProps.size || 'small'} />
      </HoliButton>
      <View style={[styles.titleContainer]}>
        <HoliText bold={!!titleBold}>
          <HoliButton inline transparent label={titleLabel} onPress={onTitlePressed}>
            {title}
          </HoliButton>
        </HoliText>

        <View style={styles.row}>
          {!!date && (
            <HoliText size="small" style={styles.date}>
              {date}
            </HoliText>
          )}
        </View>
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    titleContainer: {
      flexDirection: 'column',
      marginHorizontal: 16,
      flex: 1,
    },
    date: {
      marginTop: 4,
      color: theme.colors.foreground20,
    },
  })

export default HoliMediaHeader
