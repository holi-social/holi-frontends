import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WithLocalSvg } from 'react-native-svg';

import { getUsers, UserData } from 'shared/api';
import Users from 'shared/Users'
import Button from 'shared/components/button'
import Counter from 'shared/components/counter'

export default function App() {
  const [users, setUsers] = useState<Array<UserData>>([])
  useEffect(() => {
    getUsers().then(users => setUsers(users))
  })
  return (
    <View style={styles.container}>
      <WithLocalSvg
        width="50"
        height="50"
        asset={require('shared/assets/img/logo/logo.svg')}
      />
      <Text>The Awesome App!</Text>
      <Users users={users} />
      <Button text="hello" />
      <Counter />
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
