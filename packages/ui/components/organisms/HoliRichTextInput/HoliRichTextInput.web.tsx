import { useLazyQuery } from '@apollo/client'
import { $generateHtmlFromNodes } from '@lexical/html'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import type { EditorState, LexicalEditor } from 'lexical'
import React, { useCallback, useMemo, useState } from 'react'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native'

import { type UserByNameResponse, userByNameQuery } from '@holi/core/domain/shared/queries'
import type { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { TEXT_INPUT_HORIZONTAL_PADDING, TEXT_INPUT_VERTICAL_PADDING } from '@holi/ui/components/molecules/HoliTextInput'
import type { HoliRichTextInputProps } from '@holi/ui/components/organisms/HoliRichTextInput/HoliRichTextInput'
import { MaxLengthPlugin } from '@holi/ui/components/organisms/HoliRichTextInput/helper/MaxLengthPlugin'
import { convertStringToLexicalJson } from '@holi/ui/components/organisms/HoliRichTextInput/helper/convertStringToLexicalJson'
import HoliFocusPlugin from '@holi/ui/helper/lexical/HoliFocusPlugin'
import HoliMentionsPlugin, { $getPureTextFromHtml } from '@holi/ui/helper/lexical/HoliMentionsPlugin'
import { HoliMentionsPluginNode } from '@holi/ui/helper/lexical/HoliMentionsPlugin.node'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const HoliRichTextInput: React.FC<HoliRichTextInputProps> = ({
  initialValue,
  placeholder = '...',
  autofocus = false,
  minSearchChars = 2,
  maxSuggestionOptions = 5,
  debounceDelay = 300,
  mentions = [],
  isEdit = false,
  ...props
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [findUsersByName] = useLazyQuery<UserByNameResponse>(userByNameQuery)
  const [characterCount, setCharacterCount] = useState(0)

  const findUserMapped = useCallback(
    (substring: string): Promise<User[]> => {
      return new Promise((resolve, reject) => {
        findUsersByName({
          variables: {
            substring,
            offset: 0,
            limit: maxSuggestionOptions,
          },
        })
          .then((response) => resolve([...(response?.data?.userByName.data ?? [])]))
          .catch(reject)
      })
    },
    [maxSuggestionOptions, findUsersByName]
  )

  const onChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null)
      const pureText = $getPureTextFromHtml(htmlString)
      props.onChange?.(pureText)

      setCharacterCount(pureText.length)
    })
  }

  const initialJson = useMemo(
    () => JSON.stringify(convertStringToLexicalJson(initialValue || '', mentions)),
    [initialValue, mentions]
  )

  if (isEdit && typeof initialValue === 'undefined') {
    return <></>
  }

  const lexicalConfig = {
    namespace: 'HoliRichTextInput',
    nodes: [HoliMentionsPluginNode],
    onError: (error: unknown) => {
      // we ignore this known issue, which is not our use case https://stackoverflow.com/questions/74030967/keyboard-navigation-across-text-and-decorator-nodes
      if (error instanceof Error && error.message.indexOf('getDecoratorNode is not a function') > -1) {
        return
      }
      logError(error, 'Error in LexicalComposer', {
        location: 'HoliRichTextInput.LexicalComposer.onError',
      })
    },
    editorState: initialJson,
  }

  const CharacterCount = () => (
    <View style={styles.charactorCountContainer}>
      {props.showCharacterCount && props.maxNoOfCharacters && (
        <HoliText size="extrasmall" style={styles.charactorCountText}>{`${characterCount ? characterCount : 0}/${
          props.maxNoOfCharacters
        }`}</HoliText>
      )}
    </View>
  )

  return (
    <View style={props.style} testID={props.testID || 'richtext-component'}>
      {/* The View is needed for positioning the placeholder */}
      <LexicalComposer initialConfig={lexicalConfig}>
        <PlainTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable
              data-testid={props.testID ? `${props.testID}-input` : 'richtext-component-input'}
              style={StyleSheet.flatten(styles.inputDiv)}
            />
          }
          placeholder={<span style={styles.placeholder}>{placeholder}</span>}
        />
        <OnChangePlugin onChange={onChange} />
        <CharacterCount />
        <>{props.maxNoOfCharacters && <MaxLengthPlugin maxLength={props.maxNoOfCharacters} />}</>
        <HistoryPlugin />
        <HoliFocusPlugin
          autofocus={autofocus}
          onFocus={props?.onFocus as ((event: FocusEvent) => boolean) | undefined}
          onBlur={props?.onBlur as ((event: FocusEvent) => boolean) | undefined}
        />
        <HoliMentionsPlugin
          findUsersByName={findUserMapped}
          minSearchChars={minSearchChars}
          maxSuggestionOptions={maxSuggestionOptions}
          debounceDelay={debounceDelay}
        />
      </LexicalComposer>
    </View>
  )
}

export default React.memo(HoliRichTextInput)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    inputDiv: {
      // this is a web only component and paddingVertical and paddingHorizontal are not supported
      paddingLeft: TEXT_INPUT_HORIZONTAL_PADDING,
      paddingRight: TEXT_INPUT_HORIZONTAL_PADDING,
      paddingTop: TEXT_INPUT_VERTICAL_PADDING,
      paddingBottom: TEXT_INPUT_VERTICAL_PADDING,
      outlineWidth: 0,
    },
    placeholder: {
      color: theme.colors.foreground20,
      overflow: 'hidden',
      position: 'absolute',
      ...Platform.select({
        web: {
          textOverflow: 'ellipsis',
        },
      }),
      top: TEXT_INPUT_VERTICAL_PADDING,
      left: TEXT_INPUT_HORIZONTAL_PADDING,
      userSelect: 'none',
      display: 'inline-block',
      pointerEvents: 'none',
    },
    charactorCountText: {
      color: theme.colors.foreground20,
    },
    charactorCountContainer: {
      flex: 1,
      alignItems: 'flex-end',
      marginTop: 6,
    },
  })
