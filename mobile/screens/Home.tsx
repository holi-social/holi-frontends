import * as React from 'react';
import { SetStateAction, useEffect, useState } from 'react';
import { Heading, Box, Button } from 'native-base';
import Users from 'shared/components/Users'
import Example from 'shared/components/Example'
import { getUsers, UserData } from 'shared/api';


export function HomeScreen({ navigation }) {

  const [users, setUsers] = useState<Array<UserData>>([])
  useEffect(() => {
    getUsers().then((users: SetStateAction<UserData[]>) => setUsers(users))
  })

  return (
    // <Box style={{ display: 'flex' }} height="100%" safeArea borderWidth="1" borderColor="info.500">
    <Box>
      <Heading color="primary.600">Awesome HOLI!</Heading>
      <Users users={users} />
      <Box alignItems="center" py={2}>
        <Example />
      </Box>
      {/* <Box alignItems="center" py={2}>
        <Button onPress={() => navigation.navigate('Colors')}>Go to Colors</Button>
      </Box> */}
    </Box>
  );
}
