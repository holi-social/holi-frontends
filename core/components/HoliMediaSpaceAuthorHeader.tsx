import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import { getInitials } from '@holi/core/helpers'
import { getFormattedDate } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import { AvatarSize } from '@holi/ui/components/molecules/HoliAvatar'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { PropsWithSkeleton } from '@holi/ui/components/types'

type OnPressHandler = (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>

export type Author = Pick<User, 'id' | 'fullName' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'avatarLabel'>
interface Props {
  style?: StyleProp<ViewStyle>
  testID?: string
  avatarSize?: AvatarSize
  author: Author
  space: Space
  date?: string
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
      datePrefix={author.fullName}
      date={formattedDate}
      onAvatarPressed={onAvatarPressed ?? (() => navigate(`/space/${space?.name}`))}
      onTitlePressed={onTitlePressed ?? (() => navigate(`/space/${space?.name}`))}
      style={style}
      testID={testID}
    />
  )
}

export default memo(HoliMediaAuthorHeader)
