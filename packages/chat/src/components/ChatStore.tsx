import { useAtomValue, useSetAtom } from 'jotai'
import { memo } from 'react'

import { addToRoomAtoms, roomAtomsRecordAtom, useSubscribeToRoomAndMessageUpdates } from '@holi/chat/src/store'

const ChatStore = () => {
  useSubscribeToRoomAndMessageUpdates()
  useAtomValue(roomAtomsRecordAtom)
  useSetAtom(addToRoomAtoms)

  return null
}

export default memo(ChatStore)
