import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { BLUR_COMMAND, COMMAND_PRIORITY_EDITOR, FOCUS_COMMAND } from 'lexical'
import React, { useEffect, useLayoutEffect } from 'react'

export type HoliFocusPluginProps = {
  isOn?: boolean
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}
const HoliFocusPlugin: React.VFC<HoliFocusPluginProps> = ({ isOn = true, onFocus, onBlur }) => {
  const [editor] = useLexicalComposerContext()

  useLayoutEffect(() => {
    let stopFocusListener: () => void
    let stopBlurListener: () => void

    if (onFocus) {
      stopFocusListener = editor.registerCommand<FocusEvent | null>(FOCUS_COMMAND, onFocus, COMMAND_PRIORITY_EDITOR)
    }
    if (onBlur) {
      stopBlurListener = editor.registerCommand<FocusEvent | null>(BLUR_COMMAND, onBlur, COMMAND_PRIORITY_EDITOR)
    }

    return () => {
      stopFocusListener?.()
      stopBlurListener?.()
    }
  }, [editor, onFocus, onBlur])

  useEffect(() => {
    if (isOn) {
      editor.focus()
    }
  }, [editor, isOn])

  return null
}

export default HoliFocusPlugin
