import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeBaseProvider, extendTheme, Text, Box } from 'native-base';


import { getUsers, UserData } from 'shared/api';
import Users from 'shared/Users'
import Example from 'shared/Example'


const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};
const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  const [users, setUsers] = useState<Array<UserData>>([])
  useEffect(() => {
    getUsers().then(users => setUsers(users))
  })
  return (
    <NativeBaseProvider theme={theme}>
      <Box flex={1} bg="#0f0" alignItems="center" justifyContent="center">
        <Text>Awesome HOLI!</Text>
        <Users users={users} />
        <Example />
      </Box>
    </NativeBaseProvider>
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
