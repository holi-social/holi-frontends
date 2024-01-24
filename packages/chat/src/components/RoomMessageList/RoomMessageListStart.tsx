import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

interface RoomMessageListStartProps {
  chatPartnerHoliUser: User
  member: ChatRoomMember | undefined
}

const RoomMessageListStart = ({ chatPartnerHoliUser, member }: RoomMessageListStartProps) => {
  const { t } = useTranslation()

  return (
    <View>
      <HoliLink
        href={`/profile/${chatPartnerHoliUser.id}`}
        label={t('user.visitProfile', { name: chatPartnerHoliUser.fullName })}
      >
        <HoliAvatar
          imageSrc={member?.avatar}
          imageBlurhash={chatPartnerHoliUser.avatarBlurhash}
          label={chatPartnerHoliUser.fullName}
          initials={chatPartnerHoliUser.avatarLabel}
          defaultColor={chatPartnerHoliUser.avatarDefaultColor}
          size="large"
        />
        <HoliGap size="xs" />

        <HoliHeading level="2">{chatPartnerHoliUser.fullName}</HoliHeading>
      </HoliLink>
      <HoliGap size="s" />

      <HoliText>
        <Trans t={t} i18nKey={'chat.room.start.description'} values={{ fullName: chatPartnerHoliUser.fullName }}>
          <HoliTextLink
            label={t('user.visitProfile', { name: chatPartnerHoliUser.fullName })}
            href={`/profile/${chatPartnerHoliUser.id}`}
            variant="primary"
          />
        </Trans>
      </HoliText>
    </View>
  )
}

export default RoomMessageListStart
