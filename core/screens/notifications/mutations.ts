import { gql } from '@apollo/client'

export interface RegisterDeviceInput {
  token: string
  deviceType: string
}

export interface RegisterDeviceResponse {
  success: boolean
}

export const registerDeviceMutation = gql`
  mutation RegisterDevice($input: RegisterDeviceInput!) {
    registerDevice(input: $input) {
      success
    }
  }
`

export const updateNotificationsPreferences = gql`
  mutation UpdateNotificationsPreferences($input: Notifications_UpdatePreferencesInput!) {
    notifications_updatePreferences(input: $input) {
      id
      category
      preferences {
        push
        email
      }
    }
  }
`
