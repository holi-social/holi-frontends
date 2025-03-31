import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import VideoCall from '@holi/core/screens/videoCall/VideoCall'
import { getOrigin } from '@holi/web/helpers/getOrigin'

const VideoCallPage: NextPage = () => <VideoCall />

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { roomName } = context.query
  const origin = getOrigin(context.req)

  const uri = new URL(origin)
  if (roomName) {
    uri.pathname = decodeURIComponent('/api/video-call/' + roomName)
  }

  return {
    redirect: {
      permanent: false,
      destination: uri.toString(),
    },
  }
}

export default VideoCallPage
