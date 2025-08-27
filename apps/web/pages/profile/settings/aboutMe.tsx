import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const AboutMe = dynamic(() => import('@holi/core/screens/userprofile/AboutMe'), {
  ssr: false,
})
const AboutMePage: NextPage = () => <AboutMe />

export default AboutMePage
