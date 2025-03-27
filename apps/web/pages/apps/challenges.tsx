import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import { challengesPathWithSessionTransfer } from '@holi-apps/challenges/helpers/navigation'
import ChallengesAppHome from '@holi-apps/challenges/screens/ChallengesAppHome'

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

  const uri = challengesPathWithSessionTransfer(singlePath)

  return {
    redirect: {
      permanent: false,
      destination: uri,
    },
  }
}

export default ChallengesAppHomePage
