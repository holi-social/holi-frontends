import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { userByIdQuery } from '@holi/core/domain/shared/queries'
import UserProfile from '@holi/core/screens/userprofile/UserProfile'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const UserProfilePage: NextPage = () => <UserProfile />

export const getServerSideProps = async (context: NextPageContext) => {
  const { userId } = context.query

  const queries = [
    {
      query: userByIdQuery,
      variables: {
        userId,
      },
      skip: !userId,
    },
  ]

  return createServerSideProps(context, queries, {
    uuidParams: [userId],
    blockIndexing: true,
  })
}

export default UserProfilePage
