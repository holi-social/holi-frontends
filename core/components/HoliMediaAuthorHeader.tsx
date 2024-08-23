import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { getFormattedDate } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { AvatarSize } from '@holi/ui/components/molecules/HoliAvatar'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { PropsWithSkeleton } from '@holi/ui/components/types'

type OnPressHandler = (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>

export type Author = Pick<
  User,
  'id' | 'fullName' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'avatarLabel' | 'role'
>
interface Props {
  style?: StyleProp<ViewStyle>
  testID?: string
  avatarSize?: AvatarSize
  author: Author
  role?: string
  authorBold?: boolean
  date?: string
  onAvatarPressed?: OnPressHandler
  onTitlePressed?: OnPressHandler
}

export type HoliMediaAuthorHeaderProps = PropsWithSkeleton<Props>

const HoliMediaAuthorHeader = ({
  date,
  author,
  authorBold,
  avatarSize,
  role,
  loading,
  style,
  testID,
  onAvatarPressed,
  onTitlePressed,
}: HoliMediaAuthorHeaderProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()

  if (loading) {
    const authorName = t('user.profileView.anonymous')
    return (
      <HoliMediaHeader
        loading
        avatarProps={{
          imageSrc: '',
          imageBlurhash: '',
          label: authorName,
          initials: '',
          defaultColor: '',
          size: avatarSize,
        }}
        style={style}
        testID={testID}
      />
    )
  }

  // converting given timestamp to a date first (with "00:00:00" as time) to show the real days instead of exact
  // timestamp calculations
  const formattedDate = getFormattedDate(date, i18n.language)
  return (
    <HoliMediaHeader
      title={author.fullName}
      titleLabel={author.fullName}
      titleBold={authorBold}
      avatarProps={{
        imageSrc: author.avatar || '',
        imageBlurhash: author.avatarBlurhash || '',
        label: author.fullName,
        initials: author.avatarLabel,
        defaultColor: author.avatarDefaultColor,
        size: avatarSize,
      }}
      role={role}
      date={formattedDate}
      onAvatarPressed={onAvatarPressed ?? (() => navigate(`/profile/${author?.id}`))}
      onTitlePressed={onTitlePressed ?? (() => navigate(`/profile/${author?.id}`))}
      style={style}
      testID={testID}
    />
  )
}

export default memo(HoliMediaAuthorHeader)
