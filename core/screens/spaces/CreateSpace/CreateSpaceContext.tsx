import { createContext } from 'react'

import { Topic } from '@holi/core/screens/userprofile/types'

export type SpaceInfo = {
  name: string
  goal: string
  topics?: Topic[]
  mainImage: string
}
export interface CreateSpaceContextType {
  setSpaceInfo: (space: SpaceInfo) => void
  spaceInfo: SpaceInfo
}

const CreateSpaceContext = createContext<CreateSpaceContextType | null>(null)
export default CreateSpaceContext
