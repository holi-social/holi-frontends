import type { ParsedURL, QueryParams } from 'expo-linking'

import useRouting from './useRouting'
import { navigateOptions } from './useRouting/types'

interface UseLinking {
  currentUrl: string
  createUrl: (path: string) => string
  openUrl: (routeName: string, options?: navigateOptions) => void
  parsedUrl: ParsedURL
}

const createPartialUrl = (currentUrl: string) => {
  const origin = new URL(currentUrl).origin
  return (path: string) => origin + path
}

const createQueryParams = (params: URLSearchParams): QueryParams | null => {
  if (params.size === 0) return null

  const result: QueryParams = {}
  for (const [key, value] of params) {
    result[key] = value
  }

  return result
}

// TODO: implement unit test for this hook
const useLinking = (): UseLinking => {
  const { navigate } = useRouting()
  const currentUrl = window.location.href
  const createUrl = createPartialUrl(currentUrl)
  const url = new URL(currentUrl)

  const parsedUrl: ParsedURL = {
    scheme: null,
    hostname: url.hostname,
    path: url.pathname,
    queryParams: createQueryParams(url.searchParams),
  }

  const openUrl = navigate

  return { openUrl, createUrl, currentUrl, parsedUrl }
}

export default useLinking
