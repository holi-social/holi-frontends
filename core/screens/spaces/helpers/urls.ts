import slugify from 'slugify'

import { jitsiUrl, owncloudUrl } from '@holi/core/screens/spaces/helpers/config'
import { Space } from '@holi/core/screens/spaces/types'

export const getUrlForSpaceStorage = (space?: Space) =>
  space ? `${owncloudUrl}/files/spaces/${space.name}` : owncloudUrl

export const generateSpaceVideoCallUrl = (space: Space, roomName: string) =>
  jitsiUrl + '/' + slugify(`${space.name}-${roomName}`)
