import slugify from 'slugify'

import { jitsiUrl } from '@holi/core/helpers/config'
import type { Space } from '@holi/api/graphql/graphql-codegen'

export const generateSpaceVideoCallUrl = (space: Pick<Space, 'name'>, roomName: string) =>
  jitsiUrl + '/' + slugify(`${space.name}-${roomName}`)
