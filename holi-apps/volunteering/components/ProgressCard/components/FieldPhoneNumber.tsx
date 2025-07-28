import React from 'react'
import { Linking, Platform } from 'react-native'

import { Stack } from 'holi-bricks/components/stack'
import { FileCopy, PhoneLine } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import { logError } from '@holi/core/errors/helpers'

const isWeb = Platform.OS === 'web'

interface FieldPhoneNumberProps {
  phoneNumber: string
}

export const FieldPhoneNumber = ({ phoneNumber }: FieldPhoneNumberProps) => {
  const callNumber = () => {
    const telUrl = `tel:${phoneNumber}`
    Linking.openURL(telUrl).catch((err) => {
      logError(err, 'Error opening phone dialer on ' + Platform.OS, {
        location: 'VolunteeringDetailsScreen.callNumber',
        phoneNumber,
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
          Phone number
        </Text>
        <Text size="md">{phoneNumber}</Text>
      </Stack>
      {isWeb ? (
        <Stack flexShrink={1}>
          <Button
            icon={FileCopy}
            label="Copy"
            variant="secondary"
            onPress={() => {
              navigator.clipboard
                .writeText(phoneNumber)
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
        <ButtonIcon icon={PhoneLine} label="phone number" variant="secondary" onPress={callNumber} />
      )}
    </Stack>
  )
}
