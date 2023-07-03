export interface ChatCredentials {
  baseUrl: string
  userId: string
  deviceId?: string
  accessToken: string
  guest?: boolean
  freshLogin?: boolean
}
