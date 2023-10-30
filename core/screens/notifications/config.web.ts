import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'
import { environmentId } from '@holi/web/environment'

export const novuApplicationIdentifier = environmentId === EnvironmentId.PRODUCTION ? 'unwXQBqcNfF1' : 'U6haJNi73bg8'
export const novuBackendUrl = 'https://eu.api.novu.co'
export const novuSocketUrl = 'wss://eu.ws.novu.co'
export const notificationPollingInterval = 10000
