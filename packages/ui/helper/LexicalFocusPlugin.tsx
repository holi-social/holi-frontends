import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import React, { useEffect } from 'react'

type SomeProps = {
  initialValue?: string
}
const LexicalFocusPlugin: React.FC<SomeProps> = ({ initialValue }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.focus()

    if (initialValue) {
      // see https://lexical.dev/docs/concepts/editor-state
      editor.update(() => {
        // TODO: hand over inital content here ???
        // const html = getHtmlFromPureText(initialValue, dummyUser)
        // const dom = new DOMParser().parseFromString(html || '', 'text/html')
        // const nodes = $generateNodesFromDOM(editor, dom)
        // $getRoot().append(nodes[0])
        // $getRoot().selectEnd()
        // $getRoot().select()
        // $insertNodes(nodes)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  return null
}

export default LexicalFocusPlugin
