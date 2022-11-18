import { $generateHtmlFromNodes } from '@lexical/html'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { EditorState, LexicalEditor } from 'lexical'
// import { $createParagraphNode, $createTextNode, $getRoot, $getSelection } from 'lexical'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import type { HoliRichTextInputProps } from '@holi/ui/components/organisms/HoliRichTextInput'
import HoliLexicalFocusPlugin from '@holi/ui/helper/HoliLexicalFocusPlugin'
import HoliLexicalMentionsPlugin, { getPureTextFromHtml } from '@holi/ui/helper/HoliLexicalMentionsPlugin'
import { HoliLexicalMentionsPluginNode } from '@holi/ui/helper/HoliLexicalMentionsPlugin.node'
import { colors } from '@holi/ui/styles/globalVars'

const HoliRichTextInput: React.VFC<HoliRichTextInputProps> = ({ initalValue = '', placeholder = '...', ...props }) => {
  const inputId = `richtext_input-${Math.random()}`

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
  // The json format works well, but how to create this nodes?
  if (initalValue && initalValue.length > 0) {
    throw new Error('[HoliRichTextInput] initialValue is not yet implemented.')
  }
  // const initalJson =
  //   '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"hello ","type":"text","version":1},{"detail":1,"format":0,"mode":"segmented","style":"","text":"Uschi Meyer","type":"mention","version":1,"userId":"0001","userName":"Uschi Meyer","displayString":"@Uschi Meyer"},{"detail":0,"format":0,"mode":"normal","style":"","text":" und ","type":"text","version":1},{"detail":1,"format":0,"mode":"segmented","style":"","text":"Paul Auster","type":"mention","version":1,"userId":"0006","userName":"Paul Auster","displayString":"@Paul Auster"}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
  // const initialHtml =
  //   '<p dir="ltr"><span>Hallo </span><span data-user-id="Uschi Meyer" data-lexical-mention="true">@0001</span><span> und </span><span data-user-id="Paul Müller" data-lexical-mention="true">@0002</span></p>'

  const lexicalConfig = {
    namespace: 'HoliRichTextInput',
    nodes: [HoliLexicalMentionsPluginNode],
    // editorState: initalJson,
    // editorState: () => {
    //   const parser = new DOMParser()
    //   const dom = parser.parseFromString(initialHtml, 'text/html')
    //   const nodes = $generateNodesFromDOM(editor, dom) // no editor here ;-(
    //   $getRoot().select()
    //   $insertNodes(nodes)
    //   // or
    //   // const paragraph = $createParagraphNode()
    //   // const text = $createTextNode('sdfsdf')
    //   // paragraph.append(text)
    //   // $getRoot().append(paragraph)
    //   // $getRoot().selectEnd()
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
        <HoliLexicalFocusPlugin />
        <HoliLexicalMentionsPlugin />
      </LexicalComposer>
    </View>
  )
}

export default React.memo(HoliRichTextInput)

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
