import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Button from '../../components/ui/Button'
import useRouting from '../useRouting'

type DrawerProps = {
  open: boolean
  onClose: () => void
  children?: React.ReactChildren
}

export const Drawer: React.VoidFunctionComponent<DrawerProps> = ({ open, onClose, children = <DrawerContent /> }) => {
  // TODO close on route change
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        position: 'absolute',
        backgroundColor: 'gray',
        zIndex: 888,
        height: '100%',
        width: open ? '30%' : 0,
        overflow: 'hidden',
      }}
    >
      {children}
      <Button onPress={onClose}>close</Button>
    </View>
  )
}

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
        <Button onPress={() => navigate('/')}>Home</Button>
        <Button onPress={() => navigate('/settings')}>Settings</Button>
        <Button onPress={() => alert('Uuuuuh - an alert!')}>Click me!</Button>
      </ScrollView>

      {/* <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      
        <DrawerItem label="Click me!" onPress={() => alert('Uuuuuh - an alert!')} />
      </DrawerContentScrollView> */}

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
