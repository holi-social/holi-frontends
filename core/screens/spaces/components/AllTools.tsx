import React, { useEffect } from 'react'
import { View } from 'react-native'

interface AllToolsProps {
  spaceIdOrName: string | undefined
}

//TODO: Implement Screen
const AllTools: React.FC<AllToolsProps> = ({ spaceIdOrName }: AllToolsProps) => {
  useEffect(() => {
    console.log('spaceIdOrName : ', spaceIdOrName)
  }, [spaceIdOrName])
  return <View />
}

export default AllTools
