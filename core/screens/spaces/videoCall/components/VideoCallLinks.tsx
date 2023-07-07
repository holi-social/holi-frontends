import { useQuery } from '@apollo/client'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import AddVideoCallLink from '@holi/core/screens/spaces/videoCall/components/AddVideoCallLink'
import VideoCallLinkCard from '@holi/core/screens/spaces/videoCall/components/VideoCallLinkCard'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface VideoCallLinksProps {
  spaceIdOrName: string | undefined
}

const VideoCallLinks: React.FC<VideoCallLinksProps> = ({ spaceIdOrName }: VideoCallLinksProps) => {
  const { navigate } = useRouting()
  const mixins = useStyleMixins()

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  if (errorSpace) {
    logError(errorSpace, `[VideoCallLinks.tsx] ${errorSpace.message}`)
  }

  if (!loadingSpace && !isAdmin && !isCollaborator) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  if (loadingSpace || !space) {
    // TODO(SF): display skeleton
    return <></>
  }

  return (
    <View style={[mixins.container, styles.container]}>
      <AddVideoCallLink space={space} />
      {/* TODO(SF) add pagination */}
      {space?.videoCallLinks?.data?.map((link) => (
        <VideoCallLinkCard key={link.id} space={space} videoCallLink={link} />
      ))}
    </View>
  )
}

export default VideoCallLinks

const styles = StyleSheet.create({
  container: {
    margin: 24,
  },
})
