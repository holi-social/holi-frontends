import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import { getFormattedDate } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { User } from '@holi/core/screens/userprofile/types'
import { AvatarSize } from '@holi/ui/components/molecules/HoliAvatar'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { PropsWithSkeleton } from '@holi/ui/components/types'

type OnPressHandler = (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>

interface Props {
  style?: StyleProp<ViewStyle>
  testID?: string
  avatarSize?: AvatarSize
  author: User
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
  const formattedDate = date ? getFormattedDate(new Date(date).toDateString(), i18n.language) : undefined
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
      date={formattedDate}
      onAvatarPressed={onAvatarPressed ?? (() => navigate(`/profile/${author?.id}`))}
      onTitlePressed={onTitlePressed ?? (() => navigate(`/profile/${author?.id}`))}
      style={style}
      testID={testID}
    />
  )
}

export default memo(HoliMediaAuthorHeader)
