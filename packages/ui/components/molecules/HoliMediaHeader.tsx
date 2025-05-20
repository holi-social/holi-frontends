import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type GestureResponderEvent, Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { VerifiedExternal, VerifiedInternal } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar, type AvatarProps } from 'holi-bricks/components/avatar'

const roleMapping: { [key: string]: string } = {
  EDITOR: 'user.profileView.role.editor',
  JOURNALIST: 'user.profileView.role.journalist',
  CO_FOUNDER: 'user.profileView.role.co_founder',
  COMMUNITY_TEAM: 'user.profileView.role.community_team',
}

interface Props {
  avatarProps: AvatarProps
  secondaryAvatarProps?: AvatarProps
  title: string
  titleLabel: string
  titleBold?: boolean
  date?: string
  datePrefix?: string
  role?: string
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
  role,
  onAvatarPressed,
  onTitlePressed,
  style,
  testID,
}: HoliMediaHeaderProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { t } = useTranslation()
  const badge = role !== 'JOURNALIST' ? VerifiedInternal : VerifiedExternal
  const showBadge = role !== 'INTERNAL' && role !== 'REGULAR'
  const avatarShape = secondaryAvatarProps ? 'square' : 'circle'

  if (loading) {
    return (
      <View style={[styles.row, style]} testID={testID}>
        <Avatar {...avatarProps} size={avatarProps?.size || 'sm'} label={''} initials="" shape="circle" />

        <View style={[styles.titleContainer]}>
          <HoliText loading />
          <HoliText size="small" style={styles.date} loading />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.row, style]} testID={testID}>
      <HoliButton
        inline
        transparent
        label={avatarProps.label || ''}
        onPress={onAvatarPressed}
        style={styles.avatarButton}
        testID="avatar-btn"
      >
        <Avatar {...avatarProps} shape={avatarShape} border="light" size={avatarProps.size || 'sm'} />
        {!!secondaryAvatarProps && (
          <View style={styles.secondaryAvatar}>
            <Avatar
              {...secondaryAvatarProps}
              shape="circle"
              size={secondaryAvatarProps?.size || 'xs'}
              label={''}
              border="light"
            />
          </View>
        )}
      </HoliButton>
      <View style={[styles.titleContainer]}>
        <HoliButton inline transparent label={titleLabel} onPress={onTitlePressed}>
          <HoliText bold={!!titleBold} numberOfLines={1}>
            {title}
          </HoliText>
        </HoliButton>

        <View style={styles.secondRow}>
          {!!role && showBadge && !secondaryAvatarProps && (
            <View style={styles.role}>
              <HoliText size="small" style={{ color: theme.colors.foreground20 }}>
                {t(roleMapping[role])}
              </HoliText>
              <HoliIcon icon={badge} size={16} style={styles.verified} />
            </View>
          )}
          {!!datePrefix && (
            <>
              <HoliText size="small" style={styles.datePrefix} ellipsizeMode="tail" numberOfLines={1}>
                {datePrefix}
              </HoliText>
              {/* when role is one of roleMapping show the icon */}
              {!!secondaryAvatarProps && showBadge ? (
                <HoliIcon icon={badge} size={16} style={styles.spaceVerified} />
              ) : (
                <HoliText size="large" style={styles.dot}>
                  &middot;
                </HoliText>
              )}
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
    secondRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing['4xs'],
    },
    avatarButton: {
      position: 'relative',
    },
    secondaryAvatar: {
      position: 'absolute',
      right: -Spacing['4xs'],
      bottom: -Spacing['4xs'],
    },
    titleContainer: {
      flexDirection: 'column',
      marginLeft: Spacing.xs,
      flex: 1,
      overflow: 'hidden',
    },
    datePrefix: {
      maxWidth: '50%',
    },
    date: {
      color: theme.colors.foreground20,
      maxWidth: '50%',
    },
    dot: {
      color: theme.colors.brandB300,
      lineHeight: 14 * 1.4,
      marginHorizontal: Spacing['4xs'],
      bottom: Platform.OS === 'web' ? 2 : -2,
    },
    role: {
      marginRight: Spacing['3xs'],
      flexDirection: 'row',
      alignItems: 'center',
    },
    verified: {
      marginLeft: 4,
    },

    spaceVerified: {
      marginLeft: Spacing['4xs'],
      marginRight: Spacing['3xs'],
    },
  })

export default HoliMediaHeader
