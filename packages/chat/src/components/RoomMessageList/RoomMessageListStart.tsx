import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import { User } from '@holi/core/domain/shared/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
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

      <Text size="md">
        <Trans t={t} i18nKey={'chat.room.start.description'} values={{ fullName: chatPartnerHoliUser.fullName }}>
          <HoliTextLink
            label={t('user.visitProfile', { name: chatPartnerHoliUser.fullName })}
            href={`/profile/${chatPartnerHoliUser.id}`}
            size="md"
            variant="special"
          />
        </Trans>
      </Text>
    </View>
  )
}

export default RoomMessageListStart
