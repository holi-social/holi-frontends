/**
 * The so called "soft-keyboard" is the mobile keyboard
 * in a cellphone's browser. It is not the native keyboard, but
 * part of the browser. And so it causes some issues: it
 * shrinks the window size and makes it scrollable. Some
 * content areas are hidden, when the soft-keyboard is open.
 * You can get the new window-size with
 * window.visualViewport.height.
 *
 * The problem is the first input focus and so the first time the
 * soft-keyboard opens. It behaves differently from the the second
 * focus and so is hard to judge.
 *
 * Another problem is, that the page becomes scrollable. But this
 * scrollcontainer is not part of the website and so not handable.
 * You can not stop the page from being scrolled with e.g. "overflow: hidden".
 * The user can scroll out the bottom view, allthough it is at the right
 * position.
 *
 * There are some blog articles and plugIns, which has implemented it.
 * For example this: https://github.com/straxico/use-detect-keyboard-open
 * or https://www.codemzy.com/blog/sticky-fixed-header-ios-keyboard-fix
 * But none of them handle the case with the first click and the window scrolling.
 *
 * Doku about the safari viewport: https://github.com/WICG/visual-viewport
 */
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'

import { useDebounce } from '@holi/ui/helper/useDebounce'

export type useSoftKeyboardProps = {
  preventAutoScrolling?: boolean
  scrollDebounce?: number
  viewportDebounce?: number
  active?: boolean
}

const defaultProps = {
  preventAutoScrolling: true,
  scrollDebounce: 50,
  viewportDebounce: 300,
  active: true,
}

export const useSoftKeyboard = (props?: useSoftKeyboardProps) => {
  const { preventAutoScrolling, scrollDebounce, viewportDebounce, active } = { ...defaultProps, ...props }
  const [lastViewPortHeight, setLastViewPortHeight] = useState(0)
  const [lastWindowHeight, setLastWindowHeight] = useState(0)
  const [lastKeyboardOpen, setLastKeyboardOpen] = useState<boolean>()

  const onResize = useDebounce((event?: SyntheticEvent<Event>) => {
    const viewPortHeight = event ? event.target?.height : window?.visualViewport?.height
    const viewPortOffset = event ? event.target?.offsetTop : window?.visualViewport?.offsetTop
    const viewPortPageTop = event ? event.target?.pageTop : window?.visualViewport?.pageTop
    const windowHeight = window?.innerHeight
    let keyboardIsOpen = windowHeight > viewPortHeight
    const stateHasChanged = keyboardIsOpen !== lastKeyboardOpen
    const windowHeightHasChanged = windowHeight !== lastWindowHeight

    if (keyboardIsOpen) {
      if (!stateHasChanged && windowHeightHasChanged && viewPortHeight !== windowHeight) {
        keyboardIsOpen = false
      }
    } else if (!keyboardIsOpen) {
      if (!stateHasChanged && windowHeightHasChanged) {
        keyboardIsOpen = true
      }
    }

    if (viewPortOffset === viewPortPageTop) {
      // This is the first input focus.
      // Somehow it differs from the further ones.
    }

    setLastWindowHeight(windowHeight)
    setLastKeyboardOpen(keyboardIsOpen)
    setLastViewPortHeight(viewPortHeight)
  }, viewportDebounce)

  const scrollToTop = useDebounce(() => {
    window?.scroll?.(0, 0)
  }, scrollDebounce)

  const onScroll = useCallback(scrollToTop, [scrollToTop])

  useEffect(() => {
    if (active === false) return
    window?.visualViewport?.addEventListener('resize', onResize)
    if (preventAutoScrolling) window?.visualViewport?.addEventListener('scroll', onScroll)
    onResize()
    return () => {
      window?.visualViewport?.removeEventListener('scroll', onScroll)
      window?.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [onResize, onScroll, preventAutoScrolling, active])

  return {
    softkeyboardIsOpen: !!lastKeyboardOpen,
    viewPortHeight: lastViewPortHeight,
  }
}
