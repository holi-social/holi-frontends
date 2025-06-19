import type { Space } from '@holi/api/graphql/graphql-codegen'
import { spaceRoomAtomCreator } from '@holi/chat/src/store'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Chat3 } from '@holi/icons/src/generated'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { useAtomValue } from 'jotai/index'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const SpaceChatRoomIcon = (props: {
  space: Pick<Space, 'id' | 'name'>
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const spaceId = props.space.id
  const spaceRoom = useAtomValue(useMemo(() => spaceRoomAtomCreator(spaceId), [spaceId]))

  if (spaceRoom) {
    return (
      <HoliButtonBell
        label={t('spaces.actions.chat', { spaceName: props.space.name })}
        icon={Chat3}
        showBell={spaceRoom.notificationCount > 0}
        onPress={() => navigate(`/chat?activeTab=${spaceRoom.id}`)}
      />
    )
  }
}
