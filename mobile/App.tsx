import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Holicon from "shared/holicon"
import Button from 'shared/components/button'

import { getUsers, UserData } from 'shared/api';
import Users from 'shared/Users'

export default function App() {
  const [users, setUsers] = useState<Array<UserData>>([])
  useEffect(() => {
    getUsers().then(users => setUsers(users))
  })
  return (
    <View style={styles.container}>
      <Text>The Awesome App!</Text>
      <Holicon icon="person" size={20} color="#0f0" />
      <Users users={users} />
      <Button text="hello" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
