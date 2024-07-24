import React, { useMemo } from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar, { type AvatarProps } from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { PropsWithSkeleton } from '@holi/ui/components/types'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props {
  avatarProps: AvatarProps
  secondaryAvatarProps?: AvatarProps
  title: string
  titleLabel: string
  titleBold?: boolean
  date?: string
  datePrefix?: string
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
  secondaryAvatarProps,
  date,
  datePrefix,
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
      <HoliButton inline transparent label={avatarProps.label} onPress={onAvatarPressed} style={styles.avatarButton}>
        <HoliAvatar {...avatarProps} size={avatarProps.size || 'small'} />
        {!!secondaryAvatarProps && (
          <HoliAvatar
            {...secondaryAvatarProps}
            size={secondaryAvatarProps?.size || 'micro'}
            label={''}
            style={styles.secondaryAvatar}
          />
        )}
      </HoliButton>
      <View style={[styles.titleContainer]}>
        <HoliButton inline transparent label={titleLabel} onPress={onTitlePressed}>
          <HoliText bold={!!titleBold} numberOfLines={1}>
            {title}
          </HoliText>
        </HoliButton>

        <View style={styles.row}>
          {!!datePrefix && (
            <>
              <HoliText size="small" style={styles.datePrefix} ellipsizeMode="tail" numberOfLines={1}>
                {datePrefix}
              </HoliText>
              <HoliText size="large" style={styles.dot}>
                &middot;
              </HoliText>
            </>
          )}
          {!!date && (
            <HoliText size="small" style={styles.date} numberOfLines={1}>
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
      alignItems: 'center',
    },
    avatarButton: {
      position: 'relative',
    },
    secondaryAvatar: {
      position: 'absolute',
      right: -Spacing['4xs'],
      bottom: -Spacing['4xs'],
      borderWidth: 2,
      borderColor: theme.colors.background10,
    },
    titleContainer: {
      flexDirection: 'column',
      marginLeft: Spacing.xs,
      flex: 1,
      overflow: 'hidden',
    },
    datePrefix: {
      marginTop: Spacing['4xs'],
      maxWidth: '50%',
    },
    date: {
      marginTop: Spacing['4xs'],
      color: theme.colors.foreground20,
      maxWidth: '50%',
    },
    dot: {
      color: theme.colors.brandB300,
      marginHorizontal: Spacing['4xs'],
    },
  })

export default HoliMediaHeader
