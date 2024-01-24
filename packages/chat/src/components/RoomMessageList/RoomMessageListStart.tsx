import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
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

        <HoliBox padding={[8, 0, 0, 0]}>
          <HoliHeading level="2">{chatPartnerHoliUser.fullName}</HoliHeading>
        </HoliBox>
      </HoliLink>

      <HoliBox padding={[16, 0, 0, 0]}>
        <HoliText>
          <Trans t={t} i18nKey={'chat.room.start.description'} values={{ fullName: chatPartnerHoliUser.fullName }}>
            <HoliTextLink
              label={t('user.visitProfile', { name: chatPartnerHoliUser.fullName })}
              href={`/profile/${chatPartnerHoliUser.id}`}
              color="brandB300"
            />
          </Trans>
        </HoliText>
      </HoliBox>
    </View>
  )
}

export default RoomMessageListStart
