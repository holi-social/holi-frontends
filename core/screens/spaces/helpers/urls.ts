import { owncloudUrl } from '@holi/core/screens/spaces/helpers/config'
import { Space } from '@holi/core/screens/spaces/types'

export const getUrlForSpaceStorage = (space?: Space) =>
  space ? `${owncloudUrl}/files/spaces/${space.name}` : owncloudUrl
