import { NextPage } from 'next'
import { View, Text } from 'react-native'
import useRouting from 'shared/navigation/useRouting'

const DetailPage: NextPage = () => {
  const router = useRouting()
  return (
    <View>
      <Text>{router.query.id}</Text>
    </View>
  )
}

export default DetailPage
