import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'

import { getAuthenticatedSession } from '@holi/core/auth/helpers/auth'
import { HomeFeedScreen } from '@holi/core/home/HomeFeedScreen'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getAuthenticatedSession()
  console.log('getServerSideProps', session)
  return {
    props: {},
  }
}

const HomeFeedPage: NextPage = () => <HomeFeedScreen />

export default HomeFeedPage
