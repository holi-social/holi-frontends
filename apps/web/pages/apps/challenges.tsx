import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import { createExternalChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import ChallengesAppHome from '@holi-apps/challenges/screens/ChallengesAppHome'

const ChallengesAppHomePage: NextPage = () => <ChallengesAppHome />

const getSinglePath = (path: string | string[] | undefined) => {
  if (Array.isArray(path)) {
    return path.length ? path[0] : ''
  }
  return path
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { path } = context.query
  const singlePath = getSinglePath(path)

  const uri = createExternalChallengesPath(singlePath)

  return {
    redirect: {
      permanent: false,
      destination: uri,
    },
  }
}

export default ChallengesAppHomePage
