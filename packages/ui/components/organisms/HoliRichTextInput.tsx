import React, { useEffect, useRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TextInputContentSizeChangeEventData,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native'

import { findMentionMatches } from '@holi/ui/helper/richText'
import type { Mention } from '@holi/ui/helper/richText'

const HoliRichInput: React.VFC = () => {
  const [pureText, setPureText] = useState('')
  const [inputText, setInputText] = useState<string | JSX.Element | (string | JSX.Element)[]>('')
  const [richText, setRichText] = useState('')
  const [mentions, setMentions] = useState<Mention[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  })
  const [editorHeight, setEditorHeight] = useState(40)

  const placeholder = 'some placeholder'
  const scrollView = useRef<ScrollView | null>(null)

  const onBlur = () => {
    console.log('onBlur()')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    // console.log('onChange()', event.nativeEvent)
  }

  const onChangeText = (text: string) => {
    setPureText(text)
    setInputText(highlightMentions(text))

    const apiText = getFormattedText()
    setRichText(apiText)

    const foundMention = findMentionMatches(text)
    console.log('foundMention', foundMention)

    // if (foundMention) {
    //   console.log('*************** show suggestions ********************')
    // }

    // This is a workaround (select by hitting enter): TODO: select from dropdown
    if (foundMention?.replaceableString?.charAt(foundMention?.replaceableString?.length - 1) === ' ') {
      addMention(foundMention)
    }

    // TODO: remove mention

    // TODO: replace mention
  }

  const addMention = (newMention: Mention) => {
    if (!newMention) return
    const trimmedMention = {
      ...newMention,
      matchingString: newMention.matchingString.trim(),
      replaceableString: newMention.replaceableString.trim(),
    }
    const newMentions = [...mentions, trimmedMention]
    const distinctMentions = [...new Map(newMentions.map((item) => [item.matchingString, item])).values()]
    setMentions(distinctMentions)
  }

  useEffect(() => {
    const apiText = getFormattedText()
    setRichText(apiText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentions])

  const highlightMentions = (text: string): string | JSX.Element | (string | JSX.Element)[] => {
    return text.split(/(\s)/g).map((item) => {
      const foundMention = findMentionMatches(item)
      if (foundMention) {
        return hightlightMention(foundMention)
      }
      return item
    })
  }

  const hightlightMention = (mention: Mention) => {
    return (
      <Text key={mention.matchingString} style={{ color: 'blue' }}>
        {mention.replaceableString}
      </Text>
    )
  }

  const getFormattedText = () => {
    if (mentions.length < 1) {
      return pureText
    }
    const newFormattedText = mentions.reduce((previousValue, currentValue) => {
      const toReplace = currentValue.replaceableString
      const replacement = `[${toReplace}:${currentValue.matchingString}] `
      const newTExt = previousValue.replace(toReplace, replacement)
      return newTExt
    }, pureText)
    return newFormattedText
  }

  const handleSelectionChange = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    const newSelection = event.nativeEvent.selection
    // if (newSelection.end === newSelection.start) return

    // console.log('handleSelectionChange() old:', JSON.stringify(selection))

    const newSelc = { ...newSelection }
    // console.log('handleSelectionChange() new:', JSON.stringify(newSelc))

    // TODO: adjust selections for mentions
    // const prevSelc = selection
    // if (newSelc.start !== newSelc.end) {
    /**
     * if user make or remove selection
     * Automatically add or remove mentions
     * in the selection.
     */
    // newSelc = EU.addMenInSelection(newSelc, prevSelc, this.mentionsMap)
    // }
    // else{
    /**
     * Update cursor to not land on mention
     * Automatically skip mentions boundry
     */
    // setTimeout(()=>{
    // })
    // newSelc = EU.moveCursorToMentionBoundry(newSelc, prevSelc, this.mentionsMap, this.isTrackingStarted);
    // }
    setSelection(newSelc)
  }

  const onContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    // console.log('onContentSizeChange()')
    if (event) {
      // const iosTextHeight = 20.5
      // const androidTextHeight = 20.5
      // const textHeight = Platform.OS === 'ios' ? iosTextHeight : androidTextHeight
      const height =
        Platform.OS === 'ios' ? event.nativeEvent.contentSize.height + 50 : event.nativeEvent.contentSize.height
      setEditorHeight(height)
    }
  }

  return (
    <View style={styles.container}>
      <Text>{pureText}</Text>
      <ScrollView
        ref={scrollView}
        onContentSizeChange={() => {
          // scrollView?.current?.scrollToEnd({ animated: true })
        }}
        style={[styles.scrollContainer, {}]}
      >
        <View style={[styles.formmatedTextWrapper]}>
          {/* api formatted text */}
          {richText !== '' ? (
            <Text style={[styles.formmatedText]}>{richText}</Text>
          ) : (
            <Text style={[styles.placeholderText]}>{placeholder}</Text>
          )}
        </View>
        <TextInput
          // ref={input => props.onRef && props.onRef(input)}
          multiline
          autoFocus
          placeholder={placeholder}
          numberOfLines={1}
          scrollEnabled={false}
          // value={inputText}
          // selection={selection}
          selectionColor={'#0f0'}
          onSelectionChange={handleSelectionChange}
          style={[styles.input, { height: editorHeight }]}
          onBlur={onBlur}
          onChange={onChange}
          onChangeText={onChangeText}
          onContentSizeChange={onContentSizeChange}
        >
          <Text>{inputText}</Text>
        </TextInput>
      </ScrollView>
    </View>
  )
}

export default HoliRichInput

const styles = StyleSheet.create({
  username: { color: 'blue' },
  container: {
    width: 300,
    alignSelf: 'center',
  },
  scrollContainer: {
    alignSelf: 'stretch',
    position: 'relative',
    minHeight: 80,
    maxHeight: 240,
    borderWidth: 1,
    borderColor: '#0f0',
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 20,
    minHeight: 80,
    // position: 'absolute',
    // top: 0,
    // color: 'transparent',
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: 'pink',
    // resizeMode: 'auto',
  },
  formmatedTextWrapper: {
    minHeight: 80,
    // position: 'absolute',
    // top: 0,
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '100%',
  },
  formmatedText: {
    fontSize: 16,
  },
  placeholderText: {
    color: 'rgba(0, 0, 0, 0.1)',
    fontSize: 16,
  },
})
