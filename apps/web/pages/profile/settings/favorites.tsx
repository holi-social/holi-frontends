import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const Favorites = dynamic(() => import('@holi/core/screens/userprofile/Favorites'), {
  ssr: false,
})
const FavoritesPage: NextPage = () => <Favorites />

export default FavoritesPage
