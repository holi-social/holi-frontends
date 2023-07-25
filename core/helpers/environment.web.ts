import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'
import { environmentId } from '@holi/web/environment'

// noinspection UnnecessaryLocalVariableJS
export const environment = environmentId // includes env detection within browser

export const isProduction = environment === EnvironmentId.PRODUCTION
