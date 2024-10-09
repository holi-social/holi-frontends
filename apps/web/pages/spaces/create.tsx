import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const CreateSpace = dynamic(() => import('@holi/core/screens/spaces/create/CreateSpace'), { ssr: false })

const CreateSpacePage: NextPage = () => <CreateSpace />

export default CreateSpacePage
