import AsyncStorage from '@react-native-async-storage/async-storage'
import { produce } from 'immer'

import type { ChatRoom } from '@holi/chat/src/store/types'

const ROOMS_STORE_KEY = 'mx_rooms_store' as const
export type RoomStoreKey = typeof ROOMS_STORE_KEY

const addChatRoom = produce((draft: ChatRoom[], room: ChatRoom) => {
  const prevRoom = draft.find((r) => r.id === room.id)
  if (prevRoom) return

  draft.push(room)
})

export const addRoomToStorage = async (chatRoom: ChatRoom, key: RoomStoreKey = ROOMS_STORE_KEY): Promise<void> => {
  const stringifiedRooms = await AsyncStorage.getItem(key)

  if (!stringifiedRooms) {
    await AsyncStorage.setItem(key, JSON.stringify([chatRoom]))
    return
  }

  const chatRooms: ChatRoom[] = addChatRoom(JSON.parse(stringifiedRooms), chatRoom)
  await AsyncStorage.setItem(key, JSON.stringify(chatRooms))
}

export const getInitialRoomsFromStorage = async (key: RoomStoreKey = ROOMS_STORE_KEY): Promise<ChatRoom[]> => {
  const strigifiedRooms = await AsyncStorage.getItem(key)
  if (!strigifiedRooms) {
    await AsyncStorage.setItem(key, JSON.stringify([]))
    return []
  }

  return JSON.parse(strigifiedRooms)
}
