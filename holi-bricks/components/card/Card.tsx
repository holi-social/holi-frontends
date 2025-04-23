import React from 'react'
import { Stack } from 'holi-bricks/components/stack'
import { _CardImage } from 'holi-bricks/components/card/Card.Image'
import { _CardHeader } from 'holi-bricks/components/card/Card.Header'
import { _CardContent } from 'holi-bricks/components/card/Card.Content'

const isDev = process.env.NODE_ENV === 'development'
function getDisplayName(type: unknown): string | undefined {
  if (typeof type === 'function' || (typeof type === 'object' && type !== null)) {
    const maybeComponent = type as { displayName?: string; name?: string }
    return maybeComponent.displayName || maybeComponent.name
  }
  return undefined
}

/*
  Main card container
*/
type AllowedCardChildren =
  | React.ReactElement<typeof _CardHeader>
  | React.ReactElement<typeof _CardContent>
  | React.ReactElement<typeof _CardImage>
  | null

export interface CardProps {
  testID?: string
  children: AllowedCardChildren | AllowedCardChildren[]
  onPress?(): void
}

const CardWrapper = ({ children, testID, onPress }: CardProps) => {
  if (isDev) {
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return

      const displayName = getDisplayName(child.type)
      if (!['CardHeader', 'CardContent', 'CardFooter', 'CardImage'].includes(displayName ?? '')) {
        // eslint-disable-next-line no-console
        console.error(`[Card] Invalid child <${displayName ?? 'Unknown'}> used in <Card>.`)
      }
    })
  }

  return (
    <Stack
      borderRadius="xs"
      borderWidth="sm"
      borderColor="support"
      backgroundColor="support"
      gap="3xs"
      padding="3xs"
      testID={testID}
      width="100%"
      minWidth={340}
      onPress={onPress}
    >
      {children}
    </Stack>
  )
}

type CardComponent = React.FC<CardProps> & {
  Header: typeof _CardHeader
  Content: typeof _CardContent
  Image: typeof _CardImage
}

export const Card: CardComponent = Object.assign(
  function Card(props: CardProps) {
    return <CardWrapper {...props} />
  },
  {
    Header: _CardHeader,
    Content: _CardContent,
    Image: _CardImage,
  }
)
