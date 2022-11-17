import { $generateHtmlFromNodes } from '@lexical/html'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { EditorState, LexicalEditor } from 'lexical'
// import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'
// import { dummyUser } from 'packages/ui/helper/dummyUser'
// import { $getRoot, $getSelection, EditorState, LexicalEditor } from 'lexical'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import type { HoliRichTextInputProps } from '@holi/ui/components/organisms/HoliRichTextInput'
import LexicalFocusPlugin from '@holi/ui/helper/LexicalFocusPlugin'
import { LexicalMentionNode } from '@holi/ui/helper/LexicalMentionNode'
import LexicalMentionsPlugin, { getPureTextFromHtml } from '@holi/ui/helper/LexicalMentionsPlugin'
import { colors } from '@holi/ui/styles/globalVars'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HoliRichTextInput: React.VFC<HoliRichTextInputProps> = ({ initalValue = '', placeholder = '...', ...props }) => {
  const inputId = `richtext_input-${Math.random()}`

  // When the editor changes, you can get notified via the
  // LexicalOnChangePlugin!
  const onChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      // const root = $getRoot()
      // const selection = $getSelection()
      // const json = editorState.toJSON()
      const htmlString = $generateHtmlFromNodes(editor, null)
      const pureText = getPureTextFromHtml(htmlString)
      props.onChange?.(pureText)
    })
  }

  // Catch any errors that occur during Lexical updates and log them
  // or throw them as needed. If you don't throw them, Lexical will
  // try to recover gracefully without losing user data.
  const onError = (error: Error) => {
    console.error(error)
  }

  // TODO: How to insert inital content ?????????????
  // see https://stackoverflow.com/questions/71976652/with-lexical-how-do-i-set-default-initial-text
  // const initalJson =
  //   '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"hello","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
  // const initialJson2 = JSON.stringify(createJsonFromPureText('Hello @0001 and @0002', dummyUser))

  const lexicalConfig = {
    namespace: 'HoliRichTextInput',
    nodes: [LexicalMentionNode],
    // editorState: initalJson,
    // editorState:
    //   '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"hello","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    // editorState: () => {
    //   const paragraph = $createParagraphNode()
    //   const text = $createTextNode('sdfsdf')
    //   paragraph.append(text)
    //   $getRoot().append(paragraph)
    //   $getRoot().selectEnd()
    // },
    onError,
  }

  return (
    <View style={{}}>
      <LexicalComposer initialConfig={lexicalConfig}>
        <PlainTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={<ContentEditable id={inputId} style={StyleSheet.flatten([styles.inputDiv, props.style])} />}
          placeholder={<span style={styles.placeholder}>{placeholder}</span>}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <LexicalFocusPlugin initialValue={'Hello @0001 and @0002'} />
        <LexicalMentionsPlugin />
      </LexicalComposer>
    </View>
  )
}

export default HoliRichTextInput

const styles = StyleSheet.create({
  inputDiv: {
    borderWidth: 0.5,
    borderColor: colors.borderColorGrey,
    borderStyle: 'solid',
    borderRadius: 5,
    paddingLeft: 20,
    paddingRigjt: 20,
    paddingTop: 10,
    paddingBottom: 10,
    position: 'relative',
  },
  placeholder: {
    color: colors.fontColorGrey,
    overflow: 'hidden',
    position: 'absolute',
    textOverflow: 'ellipsis',
    top: 10,
    left: 20,
    userSelect: 'none',
    display: 'inline-block',
    pointerEvents: 'none',
  },
})
