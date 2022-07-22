// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Messages.tsx
import { UiText } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'

interface Props {
  messages?: Array<UiText>
  style?: ViewStyle | Record<string, unknown>
}

const FormMessages = (props: Props) => {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation()

  return (
    <>
      {props.messages?.map(({ text, id }, k) => {
        const messageKey = `auth.login.message.${id}`
        return (
          <HoliText key={`${id}${k}`} style={[props.style || {}, { marginBottom: 10, color: theme.colors.errorRed }]}>
            {i18n.exists(messageKey) ? t(messageKey) : text}
          </HoliText>
        )
      })}
    </>
  )
}

export default FormMessages
