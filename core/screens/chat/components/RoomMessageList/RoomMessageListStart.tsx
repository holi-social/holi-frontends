import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

interface RoomMessageListStartProps {
  user: User
}

const RoomMessageListStart = ({ user }: RoomMessageListStartProps) => {
  const { t } = useTranslation()

  return (
    <View>
      <HoliAvatar
        imageSrc={user.avatar}
        imageBlurhash={user.avatarBlurhash}
        label={user.fullName}
        initials={user.avatarLabel}
        defaultColor={user.avatarDefaultColor}
        size="large"
      />

      <HoliBox padding={[8, 0, 0, 0]}>
        <HoliHeading level="2">{user.fullName}</HoliHeading>
      </HoliBox>

      <HoliBox padding={[16, 0, 0, 0]}>
        <HoliText>
          <Trans t={t} i18nKey={'chat.room.start.description'} values={{ fullName: user.fullName }}>
            <HoliTextLink
              label={t('user.visitProfile', { name: user.fullName })}
              href={`/profile/${user.id}`}
              variant="primary"
            />
          </Trans>
        </HoliText>
      </HoliBox>
    </View>
  )
}

export default RoomMessageListStart
