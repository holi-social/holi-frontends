// List of user agents of AI crawlers
export const blockedBots = [
  'AI2Bot',
  'Amazonbot',
  'anthropic-ai',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'ChatGPT-User',
  'ChatGPT-User/2.0',
  'ClaudeBot',
  'claude-web',
  'cohere-ai',
  'Diffbot',
  'Google-Extended',
  'GPTBot',
  'MistralAI-User',
  'OAI-SearchBot',
  'omgili',
  'Timpibot',
  'YouBot',
]

// List of user agents substrings used by search engine crawlers and link preview bots (python-requests is used by Okuna)
const allowedBots = ['bot', 'crawl', 'slurp', 'spider', 'facebookexternalhit', 'whatsapp', 'python-requests']

export const isBlockedBot = (userAgent = '') => {
  const normalizedUserAgent = userAgent.toLowerCase()
  return blockedBots.some((botUserAgent) => normalizedUserAgent.includes(botUserAgent.toLowerCase()))
}

export const isAllowedBot = (userAgent = '') => {
  const normalizedUserAgent = userAgent.toLowerCase()
  return allowedBots.some((botSubstring) => normalizedUserAgent.includes(botSubstring))
}
