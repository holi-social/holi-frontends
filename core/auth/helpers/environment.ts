import Constants from 'expo-constants'

export const environment = Constants.manifest?.extra?.environment

export const isDevelopment = environment === 'development'
