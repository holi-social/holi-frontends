import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getOrCreateSpaceTaskRoom, toMatrixIdentity } from '@holi/chat/src/store'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

import type { SpaceTaskSharedDataContent } from '@holi/chat/src/client/types'

type AdminUser = {
  __typename?: 'User'
  id: string
  identity?: string
  avatar?: string
  avatarBlurhash?: string
  avatarLabel: string
  avatarDefaultColor: string
  firstName?: string
  fullName: string
}

/**
 * Custom React hook for starting (or retrieving) a Matrix chat room associated with a space task.
 *
 * @param content - Task-related metadata used to identify the chat room.
 * @param adminUsers - List of space admin users who will be participants in the chat.
 *
 * @returns An object with:
 *  - `startChat`: async function to create or open a chat room.
 *  - `isLoading`: boolean indicating the async state.
 */
export const useStartChat = (content: SpaceTaskSharedDataContent, adminUsers: AdminUser[]) => {
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)

  const { taskId, spaceName: spaceTitle, holiSpaceId: spaceId } = content

  /**
   * Creates or retrieves a Matrix chat room for a given space task.
   * Optionally navigates to the chat room unless `suppressNavigation` is true.
   *
   * @param suppressNavigation - If true, prevents automatic navigation after room creation.
   * @returns The Matrix room ID, or `undefined` if room creation failed.
   */
  const startChat = async (suppressNavigation?: boolean): Promise<string | undefined> => {
    setIsLoading(true)

    try {
      // --- Validate required data ---
      if (!spaceId || !taskId || !spaceTitle) {
        displayError(new Error('Missing required task data'), 'Cannot create a task room chat', {
          location: 'useStartChat.startChat',
          spaceTitle,
        })
        return
      }

      if (!adminUsers || adminUsers.length === 0) {
        displayError(new Error('No space admins found'), 'No space admins found', {
          location: 'useStartChat.startChat',
          spaceTitle,
        })
        return
      }

      // --- Build Matrix identities for all admin users ---
      const chatPartnerMatrixIds = adminUsers.map(({ identity }) => toMatrixIdentity(identity ?? ''))

      // --- Request or create a Matrix room for this task ---
      const { room_id } = await getOrCreateSpaceTaskRoom(chatPartnerMatrixIds, {
        type: 'space.task',
        content,
      })

      // --- Handle missing room ID case ---
      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
        return
      }

      // --- Optionally navigate to the room ---
      if (!suppressNavigation) {
        navigate(`/chat/rooms/${room_id}`)
      }

      return room_id
    } catch (error) {
      // --- Global error handling and user feedback ---
      logError(error, 'Failed to start space task chat', {
        location: 'useStartChat.startChat',
        adminUsers,
        spaceTitle,
      })
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  return { startChat, isLoading }
}
