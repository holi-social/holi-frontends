import type React from 'react'
import { Stack } from 'holi-bricks/components/stack'

/*
  Card body, is meant to be versatile so we can put anything we want in here.
*/
export interface CardContentProps extends React.PropsWithChildren {
  testID?: string
  onPress?(): void
}

export const _CardContent = ({ children, testID, onPress }: CardContentProps) => {
  return (
    <Stack direction="column" testID={testID} onPress={onPress} wrap="wrap" flex={1}>
      {children}
    </Stack>
  )
}
_CardContent.displayName = 'CardContent'
