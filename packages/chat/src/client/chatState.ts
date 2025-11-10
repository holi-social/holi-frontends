import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('Chat')

const chatConnected = makeVar(false)
export const chatReloadCounter = makeVar(0)
const chatInitialized = makeVar(false)

export const setChatConnected = (value: boolean) => {
  logger.debug('chatSession.setChatConnected', 'setting value', value)
  chatConnected(value)
}

export const useChatConnected = () => {
  return useReactiveVar(chatConnected)
}

export const useChatReloadCounter = () => {
  return useReactiveVar(chatReloadCounter)
}

export const setChatInitialized = (value: boolean) => {
  logger.debug('chatSession.setChatInitialized', 'setting value', value)
  chatInitialized(value)
}

export const useChatInitialized = () => {
  return useReactiveVar(chatInitialized)
}
