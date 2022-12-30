/**
 * The so called "softkeyboard" is the mobile keyboard
 * in a cellphone's browser. It is not the native keyboard, but
 * part of the browser. And so it causes some issues: it
 * shrinks the window size and makes it scrollable. Some
 * content areas are hidden, when the softkeyboard is open.
 * You can get the new window-size with
 * window.visualViewport.height.
 *
 * The problem is the first input focus and so the first time the
 * softkeyboard opens. It behaves differently from the the second
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

import { useDebounce } from '@holi/ui/helper'

export const useSoftKeyboard = () => {
  const [lastViewPortHeight, setLastViewPortHeight] = useState(0)
  const [lastViewPortOffset, setLastViewPortOffset] = useState(0)
  const [lastWindowHeight, setLastWindowHeight] = useState(0)
  const [lastKeyboardOpen, setLastKeyboardOpen] = useState<boolean>()

  const onResize = useDebounce((event?: SyntheticEvent<Event>) => {
    const viewPortHeight = event ? event.target?.height : window?.visualViewport?.height
    let viewPortOffset = event ? event.target?.offsetTop : window?.visualViewport?.offsetTop
    const viewPortPageTop = event ? event.target?.pageTop : window?.visualViewport?.pageTop
    const windowHeight = window?.innerHeight
    let keyboardIsOpen = windowHeight > viewPortHeight
    const stateHasChanged = keyboardIsOpen !== lastKeyboardOpen
    const windowHeightHasChanged = windowHeight !== lastWindowHeight

    console.log('onResize()')

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
      viewPortOffset = viewPortPageTop - 80
      window.scroll({ top: 0, behavior: 'smooth' })
    }

    setLastWindowHeight(windowHeight)
    setLastKeyboardOpen(keyboardIsOpen)
    setLastViewPortHeight(viewPortHeight)
    setLastViewPortOffset(viewPortOffset)
  }, 200)

  const scrollToTop = useDebounce(() => {
    window?.scroll?.({ top: 0, behavior: 'smooth' })
  }, 100)

  const onScroll = useCallback(scrollToTop, [scrollToTop])

  useEffect(() => {
    window?.visualViewport?.addEventListener('scroll', onScroll)
    window?.visualViewport?.addEventListener('resize', onResize)
    onResize()
    return () => {
      window?.visualViewport?.removeEventListener('scroll', onScroll)
      window?.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [onResize, onScroll])

  return {
    softkeyboardIsOpen: !!lastKeyboardOpen,
    viewPortHeight: lastViewPortHeight,
    viewPortOffset: lastViewPortOffset,
  }
}
