// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Messages.tsx
import { UiText } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface Props {
  messages?: Array<UiText>
  style?: TextStyle
}

const FormMessages = ({ messages = [], style = {} }: Props) => {
  const { t, i18n } = useTranslation()

  return (
    <>
      {messages?.map(({ text, id }, k) => {
        const messageKey = `auth.login.message.${id}`
        return (
          <HoliText key={`${id}${k}`} style={[styles.message, style]} testID={`ory-message-${id}`}>
            {i18n.exists(messageKey) ? t(messageKey) : text}
          </HoliText>
        )
      })}
    </>
  )
}

export default FormMessages

const styles = StyleSheet.create({
  message: {
    color: colors.errorRed,
  },
})
