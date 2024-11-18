import type React from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { getInitials } from '@holi/core/helpers'
import { getFormattedDate } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { Space } from '@holi/core/screens/spaces/types'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import type { AvatarSizes } from 'holi-bricks/components/avatar'

type OnPressHandler = (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>

export type Author = Pick<
  User,
  'id' | 'fullName' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'avatarLabel' | 'role'
>
interface Props {
  style?: StyleProp<ViewStyle>
  testID?: string
  avatarSize?: AvatarSizes
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
          label: authorName,
          initials: '',
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
        imgSrc: space.avatar,
        label: space.title,
        initials,
        size: avatarSize,
        shape: 'square',
      }}
      secondaryAvatarProps={{
        imgSrc: author.avatar,
        label: author.fullName,
        initials: author.avatarLabel,
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
