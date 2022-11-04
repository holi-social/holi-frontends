import { $generateHtmlFromNodes } from '@lexical/html'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { EditorState, LexicalEditor } from 'lexical'
// import { $getRoot, $getSelection, EditorState, LexicalEditor } from 'lexical'
import React from 'react'

import LexicalFocusPlugin from '@holi/ui/helper/LexicalFocusPlugin'
import LexicalMentionsPlugin from '@holi/ui/helper/LexicalMentionsPlugin'
import { MentionNode } from '@holi/ui/helper/MentionNode'

const HoliRichInput: React.VFC = () => {
  // When the editor changes, you can get notified via the
  // LexicalOnChangePlugin!
  const onChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      // const root = $getRoot()
      // const selection = $getSelection()
      // const json = editorState.toJSON()
      const htmlString = $generateHtmlFromNodes(editor, null)
      console.log(htmlString)
    })
  }

  // Catch any errors that occur during Lexical updates and log them
  // or throw them as needed. If you don't throw them, Lexical will
  // try to recover gracefully without losing user data.
  const onError = (error) => {
    console.error(error)
  }

  const initialConfig = {
    namespace: 'MyEditor',
    nodes: [MentionNode],
    onError,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <ContentEditable
            style={{ borderWidth: 1, borderColor: 'lightgrey', borderStyle: 'solid', position: 'relative' }}
          />
        }
        placeholder={<div>Enter some text...</div>}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <LexicalFocusPlugin />
      <LexicalMentionsPlugin />
    </LexicalComposer>
  )
}

export default HoliRichInput
