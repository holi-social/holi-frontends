import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import React, { useEffect } from 'react'

const LexicalFocusPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.focus()
  }, [editor])

  return null
}

export default LexicalFocusPlugin
