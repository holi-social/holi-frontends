import { makeVar, useReactiveVar } from '@apollo/client'

import { logDebug } from '@holi/core/helpers/logging'

const chatConnected = makeVar(false)
export const chatReloadCounter = makeVar(0)
const chatInitialized = makeVar(false)

export const setChatConnected = (value: boolean) => {
  logDebug('chatSession.setChatConnected', 'setting value', value)
  chatConnected(value)
}

export const useChatConnected = () => {
  return useReactiveVar(chatConnected)
}

export const useChatReloadCounter = () => {
  return useReactiveVar(chatReloadCounter)
}

export const setChatInitialized = (value: boolean) => {
  logDebug('chatSession.setChatInitialized', 'setting value', value)
  chatInitialized(value)
}

export const useChatInitialized = () => {
  return useReactiveVar(chatInitialized)
}
