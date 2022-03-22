import React from 'react'
import { View, Text, ScrollView } from 'react-native'

import { Link } from 'shared/components/navigation/Link'
import Button from 'shared/components/ui/Button'
import useRouting from 'shared/components/navigation/useRouting'

export const DrawerContent: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          marginLeft: 13,
          paddingTop: 50,
          marginBottom: 20,
        }}
      >
        Some Text above
      </Text>

      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <Link to="/settings">
          {({ isActive }) => <Text style={{ fontWeight: isActive ? 'bold' : 'normal' }}>Settings</Text>}
        </Link>
        <Button onPress={() => navigate('/')}>Home</Button>
        <Button onPress={() => navigate('/appstore')}>AppStore xxx</Button>
        {/* TODO: duplicate ? */}
        <Button onPress={() => navigate('/settings')}>Settings</Button>
        <Button onPress={() => alert('Uuuuuh - an alert!')}>Click me!</Button>
      </ScrollView>

      <View style={{ backgroundColor: 'lightblue' }}>
        <Text
          style={{
            fontSize: 20,
            marginLeft: 13,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          Fixed bottom
        </Text>
      </View>
    </View>
  )
}
