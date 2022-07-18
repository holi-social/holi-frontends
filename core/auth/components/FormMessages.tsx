// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Messages.tsx
import { UiText } from '@ory/kratos-client'
import React from 'react'
import { ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/HoliText'
import { useTheme } from '@holi/ui/styles/theme'

interface Props {
  messages?: Array<UiText>
  style?: ViewStyle | Record<string, unknown>
}

const FormMessages = (props: Props) => {
  const { theme } = useTheme()
  return (
    <>
      {props.messages?.map(({ text, id }, k) => (
        <HoliText
          key={`${id}${k}`}
          testID={`ory-message-${id}`}
          style={[props.style || {}, { marginBottom: 10, color: theme.colors.errorRed }]}
        >
          {text}
        </HoliText>
      ))}
    </>
  )
}

export default FormMessages
