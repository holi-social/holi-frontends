import { NextPage, NextPageContext } from 'next'
import React from 'react'

import { insightsByUserIdQuery } from '@holi/core/queries'
import { featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import { spacesByMemberIdQuery } from '@holi/core/screens/spaces/queries'
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
    {
      query: featureTogglesQuery,
    },
    {
      query: insightsByUserIdQuery,
      variables: {
        userId,
      },
      skip: !userId,
    },
    {
      query: spacesByMemberIdQuery,
      variables: {
        memberId: userId,
      },
      skip: !userId,
    },
  ]

  return createServerSideProps(context, queries)
}

export default UserProfilePage
