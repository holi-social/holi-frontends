import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { challengeAppBaseUrl } from '@holi-apps/challenges/config'
import { ChallengesAppHome } from '@holi-apps/challenges/screens/ChallengesAppHome'

const ChallengesAppHomePage: NextPage = () => <ChallengesAppHome />

const getSinglePath = (path: string | string[] | undefined) => {
  if (Array.isArray(path)) {
    return path.length ? path[0] : ''
  }
  return path
}

export const getServerSideProps = async (context: NextPageContext) => {
  const { path } = context.query
  const singlePath = getSinglePath(path)

  const uri = new URL(challengeAppBaseUrl)
  if (singlePath) {
    uri.pathname = decodeURIComponent(singlePath)
  }

  return {
    redirect: {
      permanent: false,
      destination: uri.toString(),
    },
  }
}

export default ChallengesAppHomePage
