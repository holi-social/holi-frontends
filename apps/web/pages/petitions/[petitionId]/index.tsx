import type { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { PetitionDetails } from '@holi/core/screens/act/petitions/PetitionDetails'

const PetitionDetailsPage: NextPage = () => <PetitionDetails />

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return createServerSideProps(context)
}

export default PetitionDetailsPage
