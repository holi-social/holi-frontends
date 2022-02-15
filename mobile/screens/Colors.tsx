import * as React from 'react';
import { Box, Button } from 'native-base'
import Colors from 'shared/ui-lib/colors'

export function ColorsScreen({ navigation }) {

  return <>
    <Colors />
    <Box alignItems="center" py={2}>
      <Button onPress={() => navigation.navigate('Home')}>Go back Home</Button>
    </Box>
  </>;
}