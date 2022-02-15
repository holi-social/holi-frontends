import * as React from 'react';
import { SetStateAction, useEffect, useState } from 'react';
import { Heading, Box, Button } from 'native-base';
import Users from 'shared/Users'
import Example from 'shared/Example'
import { getUsers, UserData } from 'shared/api';


export function HomeScreen({ navigation }) {

  const [users, setUsers] = useState<Array<UserData>>([])
  useEffect(() => {
    getUsers().then((users: SetStateAction<UserData[]>) => setUsers(users))
  })

  return (
    <Box safeArea>
      <Heading color="primary.600">Awesome HOLI!</Heading>
      <Users users={users} />
      <Box alignItems="center" py={2}>
        <Example />
      </Box>
      <Box alignItems="center" py={2}>
        <Button onPress={() => navigation.navigate('Colors')}>Go to Colors</Button>
      </Box>
    </Box>
  );
}
