import Constants from 'expo-constants'

export const oryUrl = Constants.manifest?.extra?.ory.url

// using default because else tests won't work
export const imagesUrl = Constants.manifest?.extra?.images.url || 'https://dev-images.holi.social'
