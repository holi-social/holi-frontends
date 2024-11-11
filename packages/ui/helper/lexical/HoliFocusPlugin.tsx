import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { BLUR_COMMAND, COMMAND_PRIORITY_EDITOR, FOCUS_COMMAND } from 'lexical'
import React, { useEffect, useLayoutEffect } from 'react'

export type HoliFocusPluginProps = {
  autofocus?: boolean
  onFocus?: (event: FocusEvent) => boolean
  onBlur?: (event: FocusEvent) => boolean
}
const HoliFocusPlugin: React.FC<HoliFocusPluginProps> = ({ autofocus = true, onFocus, onBlur }) => {
  const [editor] = useLexicalComposerContext()

  useLayoutEffect(() => {
    let stopFocusListener: () => void
    let stopBlurListener: () => void

    if (onFocus) {
      stopFocusListener = editor.registerCommand(FOCUS_COMMAND, onFocus, COMMAND_PRIORITY_EDITOR)
    }
    if (onBlur) {
      stopBlurListener = editor.registerCommand(BLUR_COMMAND, onBlur, COMMAND_PRIORITY_EDITOR)
    }

    return () => {
      stopFocusListener?.()
      stopBlurListener?.()
    }
  }, [editor, onFocus, onBlur])

  useEffect(() => {
    if (autofocus) {
      editor.focus()
    }
  }, [editor, autofocus])

  return null
}

export default HoliFocusPlugin
