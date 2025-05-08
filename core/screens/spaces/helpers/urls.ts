import slugify from 'slugify'

import { jitsiUrl } from '@holi/core/helpers/config'
import { Space } from '@holi/core/screens/spaces/types'

export const generateSpaceVideoCallUrl = (space: Space, roomName: string) =>
  jitsiUrl + '/' + slugify(`${space.name}-${roomName}`)
