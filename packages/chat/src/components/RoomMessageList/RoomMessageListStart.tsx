import { Text, TextLink } from 'holi-bricks/components/text'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { ChatRoomMember } from '@holi/chat/src/client/types'
import type { User } from '@holi/core/domain/shared/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Avatar } from 'holi-bricks/components/avatar'
import useRouting from '@holi/core/navigation/hooks/useRouting'

interface RoomMessageListStartProps {
  chatPartnerHoliUsers: User[]
  members: ChatRoomMember[] | undefined
}

const RoomMessageListStart = ({ chatPartnerHoliUsers, members }: RoomMessageListStartProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const chatDescription = () => {
    const taskChat = true // todo
    const chatPartnersNames = chatPartnerHoliUsers.map((user) => user.fullName).join(', ')
    if (taskChat) {
      return (
        <Text size="md" variant="secondary">
          <Trans
            t={t}
            i18nKey={'chat.room.start.group.description'}
            values={{ fullName: chatPartnersNames, taskName: 'test' }}
          >
            <TextLink
              onPress={() => navigate('/profile/${chatPartnerHoliUser.id}')} // todo: displays error
              // {`/profile/${chatPartnerHoliUser.id}`}
              size="md"
              variant="special"
            />
          </Trans>
        </Text>
      )
    }
    return (
      <Text size="md">
        <Trans t={t} i18nKey={'chat.room.start.description'} values={{ fullName: chatPartnerHoliUsers[0].fullName }}>
          <HoliTextLink
            label={t('user.visitProfile', { name: chatPartnerHoliUsers[0].fullName })}
            href={`/profile/${chatPartnerHoliUsers[0].id}`}
            size="md"
            color="informative"
          />
        </Trans>
      </Text>
    )
  }

  return (
    <View>
      <HoliLink
        href={`/profile/${chatPartnerHoliUsers[0].id}`} // todo: individual links for each member
        label={t('user.visitProfile', { name: chatPartnerHoliUsers[0].fullName })}
      >
        <Avatar // todo: display all avatars overlapping each other
          imgSrc={members?.[0]?.avatar}
          imgPlaceholder={chatPartnerHoliUsers[0].avatarBlurhash}
          label={chatPartnerHoliUsers[0].fullName}
          initials={chatPartnerHoliUsers[0].avatarLabel}
          size="lg"
        />
        <HoliGap size="xs" />

        <Text headingLevel="2" size="xxl">
          {chatPartnerHoliUsers.map((user) => user.fullName).join(', ')}
        </Text>
      </HoliLink>
      <HoliGap size="s" />

      {chatDescription()}
    </View>
  )
}

export default RoomMessageListStart
