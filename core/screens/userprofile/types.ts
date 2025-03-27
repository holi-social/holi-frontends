import type { User } from '@holi/core/domain/shared/types'

export const isHoliUser = (value: User | unknown): value is User =>
  ['id', 'identity'].every((key) => value && typeof value === 'object' && key in value)

export enum UserConnectionStatus {
  NOT_CONNECTED = 'NOT_CONNECTED',
  CONNECTED = 'CONNECTED',
  REQUESTED = 'REQUESTED', // requested by currently authenticated user
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION', // pending confirmation by currently authenticated user
}

export enum UpdateConnectionWithUserActions {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
}

export enum UserChipTypes {
  INTERESTS = 'interests',
  SKILLS = 'skills',
}
