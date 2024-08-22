import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { getInitials } from '@holi/core/helpers'
import { getFormattedDate } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space } from '@holi/core/screens/spaces/types'
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
  space: Space
  date?: string
  role?: string
  onAvatarPressed?: OnPressHandler
  onTitlePressed?: OnPressHandler
}

export type HoliMediaSpaceAuthorHeaderProps = PropsWithSkeleton<Props>

const HoliMediaAuthorHeader = ({
  date,
  author,
  space,
  avatarSize,
  loading,
  style,
  testID,
  role,
  onAvatarPressed,
  onTitlePressed,
}: HoliMediaSpaceAuthorHeaderProps) => {
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
  const initials = getInitials(space.title)
  const formattedDate = getFormattedDate(date, i18n.language)
  return (
    <HoliMediaHeader
      title={space.title}
      titleLabel={space.title}
      titleBold
      avatarProps={{
        imageSrc: space.avatar || '',
        imageBlurhash: space.avatarBlurhash || '',
        label: space.title,
        initials,
        defaultColor: space.avatarDefaultColor,
        size: avatarSize,
        shape: 'square',
        style: {},
      }}
      secondaryAvatarProps={{
        imageSrc: author.avatar,
        imageBlurhash: author.avatarBlurhash,
        label: author.fullName,
        initials: author.avatarLabel,
        defaultColor: author.avatarDefaultColor,
        size: avatarSize,
      }}
      datePrefix={author.fullName}
      date={formattedDate}
      role={role}
      onAvatarPressed={onAvatarPressed ?? (() => navigate(`/spaces/${space?.name}`))}
      onTitlePressed={onTitlePressed ?? (() => navigate(`/spaces/${space?.name}`))}
      style={style}
      testID={testID}
    />
  )
}

export default memo(HoliMediaAuthorHeader)
