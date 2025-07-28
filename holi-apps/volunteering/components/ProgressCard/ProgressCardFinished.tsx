import React from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { Image } from 'holi-bricks/components/image'

export const ProgressCardFinished = () => {
  const { navigate } = useRouting()

  return (
    <Stack
      padding={{ left: 'xs', right: 'xs', bottom: 'xxs', top: 'xxs' }}
      gap="xs"
      backgroundColor="purpleLight"
      borderColor="main"
      borderRadius="md"
      borderStyle="solid"
      borderWidth="sm"
      direction="row"
    >
      <Stack>
        {/* todo: animate high five using lottie */}
        <Stack
          backgroundColor="greenLight"
          borderColor="main"
          borderRadius={'md'}
          borderStyle="solid"
          borderWidth={'sm'}
          height={158}
          width={110}
          alignItems="center"
          justifyContent="center"
        >
          <Image
            source={require('@holi/ui/assets/img/volunteering/high five.gif')}
            width={0}
            height={0}
            alt={'high five'}
          />
        </Stack>
      </Stack>

      <Stack flexShrink={1} gap="xs" justifyContent="space-between">
        <Stack gap="3xs">
          <Text size="lg">Great that you did this!</Text>
          <Text size="md">You made the world a little better. Do you think about what to do next?</Text>
        </Stack>

        <Button label="Find more good deeds" onPress={() => navigate('/act')} />
      </Stack>
    </Stack>
  )
}
