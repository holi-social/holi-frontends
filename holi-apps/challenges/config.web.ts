import { environment } from '@holi/core/helpers/environment'
import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

export const challengeAppBaseUrl =
  process.env.HOLI_CHALLENGES_APP ||
  (environment === EnvironmentId.PRODUCTION
    ? 'https://challenges.holi.social'
    : 'https://staging.challenges-dev.holi.social')
