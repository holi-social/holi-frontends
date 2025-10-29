import { useMutation } from '@apollo/client/react'
import { getExistingRoomId, ignoreUser, toMatrixIdentity, useSetRemoveRoomAtom } from '@holi/chat/src/store'
import type { User } from '@holi/core/domain/shared/types'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { BlockUserMutation } from '@holi/core/queries'
import type { BlockUserResponse } from '@holi/core/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useState } from 'react'

interface BlockUserOptions {
  successMsg?: string
  onHoliUserBlocked?: () => void
  onChatUserBlocked?: () => void
}

export const useBlockUser = () => {
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [blockHoliUser] = useMutation<BlockUserResponse>(BlockUserMutation)

  const removeRoom = useSetRemoveRoomAtom()
  const removeChatsWithBlockedUser = (chatUserId: string) => {
    const roomId = getExistingRoomId([chatUserId], 'private')
    if (roomId) removeRoom(roomId)
  }

  const [isLoading, setIsLoading] = useState(false)

  return [
    isLoading,
    async (
      user: User,
      { successMsg, onHoliUserBlocked = () => null, onChatUserBlocked = () => null }: BlockUserOptions = {}
    ) => {
      setIsLoading(true)

      const chatUserId = toMatrixIdentity(user.identity)
      try {
        await Promise.all([
          blockHoliUser({ variables: { userId: user.id } }).then(onHoliUserBlocked),
          ignoreUser(chatUserId).then(onChatUserBlocked),
        ])
        removeChatsWithBlockedUser(chatUserId)

        if (successMsg) openToast(successMsg, HoliToastType.SUCCESS)
      } catch (e) {
        displayError(e, 'Failed to block user', {
          location: 'useBlockUser',
        })
      } finally {
        setIsLoading(false)
      }
    },
  ] as const
}
