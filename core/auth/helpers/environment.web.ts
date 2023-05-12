export const environment: 'development' | string = process.env.ENVIRONMENT_ID || 'development'

export const isDevelopment = environment === 'development'
