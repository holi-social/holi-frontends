import { NextPage, NextPageContext } from 'next'
import React from 'react'

import UserProfile from '@holi/core/screens/userprofile/UserProfile'
import { userByIdQuery } from '@holi/core/screens/userprofile/queries'
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

  return createServerSideProps(context, queries)
}

export default UserProfilePage
