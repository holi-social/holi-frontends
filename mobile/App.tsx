import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
      <Users users={users} />
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
