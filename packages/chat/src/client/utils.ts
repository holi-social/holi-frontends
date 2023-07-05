import type { MatrixClient } from 'matrix-js-sdk'

export const hasMxClient = (client: MatrixClient | null): client is MatrixClient => !!client
