import { Text, TextLink } from 'holi-bricks/components/text'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { ChatRoomMember } from '@holi/chat/src/client/types'
import type { User } from '@holi/core/domain/shared/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import AvatarPile from 'holi-bricks/components/avatar/AvatarPile'
import useRouting from '@holi/core/navigation/hooks/useRouting'

interface RoomMessageListStartProps {
  chatPartnerHoliUsers: User[]
  members: ChatRoomMember[] | undefined
  taskName?: string
  taskId?: string
  parentSpaceId?: string
  spaceName?: string
}

const RoomMessageListStart = ({
  chatPartnerHoliUsers,
  taskName,
  taskId,
  parentSpaceId,
  spaceName,
}: RoomMessageListStartProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const chatDescription = () => {
    if (taskId) {
      return (
        <Text size="md" color="support">
          <Trans
            t={t}
            i18nKey={'chat.room.start.group.description'}
            values={{ taskName: taskName, spaceName: spaceName }}
            components={{
              fullName: (
                <>
                  {chatPartnerHoliUsers.map((user, index) => (
                    <React.Fragment key={user.id}>
                      {index > 0 && <Text size="md">, </Text>}
                      <TextLink onPress={() => navigate(`/profile/${user.id}`)} size="md" color="informative">
                        {user.fullName}
                      </TextLink>
                    </React.Fragment>
                  ))}
                </>
              ),
              taskName: (
                <TextLink
                  onPress={() => navigate(`/spaces/${parentSpaceId}/tasks/${taskId}`)}
                  size="md"
                  color="informative"
                />
              ),
              spaceName: (
                <TextLink onPress={() => navigate(`/spaces/${parentSpaceId}`)} size="md" color="informative" />
              ),
            }}
          />
        </Text>
      )
    }
    return (
      <Text size="md" color="support">
        <Trans t={t} i18nKey={'chat.room.start.description'} values={{ fullName: chatPartnerHoliUsers[0].fullName }}>
          <TextLink onPress={() => navigate(`/profile/${chatPartnerHoliUsers[0].id}`)} size="md" color="informative" />
        </Trans>
      </Text>
    )
  }

  return (
    <View>
      <AvatarPile users={chatPartnerHoliUsers} size="lg" />
      <HoliGap size="xs" />
      <Text headingLevel="2" size="xxl">
        {chatPartnerHoliUsers.map((user) => user.fullName).join(', ')}
      </Text>

      <HoliGap size="s" />

      {chatDescription()}
    </View>
  )
}

export default RoomMessageListStart
