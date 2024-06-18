import React from 'react'

/**
 * Suppresses SSR hydration warnings for cases where it can not be guaranteed that the content for the client and server are the same, e.g. formatted dates as the client's time zone is unknown to the server.
 *
 * Suppression of warnings only works for HTML tags, that is why the content is wrapped in a `span`.
 *
 * It also only works for text content and only one level deep, that is why the `children` have to be of type `string`.
 *
 * Suppression of SSR hydration warnings is only necessary on web. On mobile the children are returned unchanged.
 */
export const SuppressSsrHydrationWarning = ({ children }: { children: string | string[] }) => {
  const joinedContent = Array.isArray(children) ? children.join('') : children
  return <span suppressHydrationWarning>{joinedContent}</span>
}
