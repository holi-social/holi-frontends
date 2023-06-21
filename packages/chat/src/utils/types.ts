export interface ReducerAction<T extends string, P = undefined> {
  readonly type: T
  readonly payload: P
}

export type MessageType = 'm.text'

export interface Message {
  body: string
  msgtype: MessageType
}

export interface ChatCredentials {
  baseUrl: string
  userId: string
  deviceId?: string
  accessToken: string
  guest?: boolean
  freshLogin?: boolean
}
