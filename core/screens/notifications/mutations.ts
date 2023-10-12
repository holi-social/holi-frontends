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
