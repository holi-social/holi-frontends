import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar, { sizes as avatarSizes } from '@holi/ui/components/molecules/HoliAvatar'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface BaseProps {
  usersToShow?: number
  size?: 'micro' | 'small'
  collapse?: boolean
  counter?: boolean
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  testID?: string
  usersTotal?: number
}

interface SkeletonProps extends BaseProps {
  loading: true
  users?: User[]
}

interface Props extends BaseProps {
  loading?: false
  users: User[]
}

type HoliUserAvatarPileProps = SkeletonProps | Props

const emptyUser = (id: string, theme: HoliTheme): User => {
  const { colors } = theme

  return {
    id,
    avatarDefaultColor: colors.background30,
    avatarLabel: '  ',
    fullName: '',
  }
}

const HoliUserAvatarPile = ({
  children,
  users,
  usersToShow = 5,
  size = 'micro',
  collapse = false,
  counter = false,
  style,
  testID = 'holi-user-avatar-pile',
  loading,
  usersTotal = users?.length ?? 0,
}: React.PropsWithChildren<HoliUserAvatarPileProps>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const uniqueUsers = loading
    ? [emptyUser('l1', theme), emptyUser('l2', theme), emptyUser('l3', theme)]
    : users.reduce((newArr: User[], nextUser: User) => {
        return newArr.some((user) => user.id === nextUser.id) ? newArr : [...newArr, nextUser]
      }, [])

  return (
    <>
      <View style={[style, styles.container]} testID={testID}>
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          uniqueUsers.slice(0, usersToShow).map((user, idx) => {
            const collapseDistance = collapse ? avatarSizes[size] / -2.4 : -4

            return (
              <HoliAvatar
                key={`${testID}-${user.id}`}
                imageSrc={user.avatar}
                imageBlurhash={user.avatarBlurhash}
                label={user.fullName || t('user.profileView.anonymous')}
                initials={user.avatarLabel}
                defaultColor={user.avatarDefaultColor}
                size={size}
                style={[
                  styles.avatar,
                  {
                    marginLeft: idx ? collapseDistance : 0,
                    zIndex: idx * -1,
                  },
                ]}
                testID="pile-avatar"
                loading={loading}
              />
            )
          })
        }

        {loading && (children || counter) && <HoliText size="small" style={styles.loadingCounter} loading />}

        {!loading && (children || counter) && (
          <HoliText size="small" style={[styles.counter, styles.textGrey]}>
            {children || t('insights.editors.discussing', { count: usersTotal })}
          </HoliText>
        )}
      </View>
    </>
  )
}

export default HoliUserAvatarPile

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loadingCounter: {
      marginLeft: 8,
      width: 150,
    },
    counter: {
      marginLeft: 8,
    },
    avatar: {
      borderColor: theme.colors.background10,
      borderWidth: 2,
    },
    textGrey: {
      color: theme.colors.foreground20,
    },
  })
