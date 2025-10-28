import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect } from 'react'

import { logError } from '@holi/core/errors/helpers'

export const VIDEO_CALL_LINK_STORAGE_NAME = 'space-videocall-links_'
export const MAX_VIDEO_CALL_LINK_LIST_LENGTH = 20

export interface VideoCallStorageLink {
  id: string
  url: string
  roomName: string
  created: string
}

export interface UseVideoCallLinkStorage {
  videoCallLinks: VideoCallStorageLink[]
  addVideoCallLink: (videoCallLink: VideoCallStorageLink) => Promise<void>
}
const videoCallLinksVar = makeVar<VideoCallStorageLink[]>([])

export const useVideoCallLinkStorage = (spaceName?: string): UseVideoCallLinkStorage => {
  const storageKey = VIDEO_CALL_LINK_STORAGE_NAME + spaceName
  const videoCallLinks = useReactiveVar(videoCallLinksVar)

  useEffect(() => {
    if (spaceName) {
      AsyncStore.getItem(storageKey)?.then(async (value) => {
        try {
          const links = value ? JSON.parse(value) : []
          videoCallLinksVar(links)
        } catch (error) {
          logError(error, 'Could not parse stored video call links', {
            location: 'useVideoCallLinkStorage.useEffect',
          })
        }
      })
    }
  }, [spaceName, storageKey])

  const addVideoCallLink = useCallback(
    async (videoCallLink: VideoCallStorageLink) => {
      const newLinks = [videoCallLink, ...videoCallLinks].slice(0, MAX_VIDEO_CALL_LINK_LIST_LENGTH)
      videoCallLinksVar(newLinks)
      await AsyncStore.setItem(storageKey, JSON.stringify(newLinks))
    },
    [storageKey, videoCallLinks]
  )

  return {
    videoCallLinks,
    addVideoCallLink,
  }
}
