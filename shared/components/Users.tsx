import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { UserData } from 'shared/api'

export default function Users({users}: {users: Array<UserData>}) {
  return <>
    {users.map(user => <Text key={user.id}>User ID: {user.id}</Text>)}
  </>
}
