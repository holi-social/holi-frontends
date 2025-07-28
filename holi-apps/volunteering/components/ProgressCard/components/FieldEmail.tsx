import React from 'react'
import { Linking, Platform } from 'react-native'

import { Stack } from 'holi-bricks/components/stack'
import { FileCopy, MailLine } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import { logError } from '@holi/core/errors/helpers'

const isWeb = Platform.OS === 'web'

interface FieldEmailProps {
  email: string
}

export const FieldEmail = ({ email }: FieldEmailProps) => {
  const sendEmail = () => {
    const mailtoUrl = `mailto:${email}`
    Linking.openURL(mailtoUrl).catch((err) => {
      logError(err, 'Error opening mail app on ' + Platform.OS, {
        location: 'VolunteeringDetailsScreen.sendMail',
        email,
      })
    })
  }

  return (
    <Stack
      borderColor="default"
      borderRadius="xs"
      borderStyle="solid"
      borderWidth="sm"
      padding="xxs"
      direction="row"
      justifyContent="space-between"
      gap="xs"
      backgroundColor="support"
    >
      <Stack gap="4xs" flexShrink={1}>
        <Text size="xs" color="support">
          {/* localazy */}
          Email
        </Text>

        <Text size="md">{email}</Text>
      </Stack>

      {isWeb ? (
        <Stack flexShrink={1}>
          <Button
            icon={FileCopy}
            label="Copy"
            variant="secondary"
            onPress={() => {
              navigator.clipboard
                .writeText(email)
                .then(() => alert('Copied!'))
                .catch((err) =>
                  logError(err, 'Failed to copy', {
                    location: 'VolunteeringDetailsScreen.sendMail',
                  })
                )
            }}
          />
        </Stack>
      ) : (
        <ButtonIcon icon={MailLine} label="email" variant="secondary" onPress={sendEmail} />
      )}
    </Stack>
  )
}
