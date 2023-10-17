export interface ChatCredentials {
  baseUrl: string
  userId: string
  deviceId?: string
  deviceToken?: string
  accessToken: string
  guest?: boolean
  freshLogin?: boolean
}
