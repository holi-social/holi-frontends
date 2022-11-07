import React, { useEffect, useRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native'

import { findMentionMatches } from '@holi/ui/helper/string'

const HoliRichInput: React.VFC = () => {
  const [inputText, setInputText] = useState('')
  const [formattedText, setFormattedText] = useState('')
  const [mentions, setMentions] = useState([])
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  })
  const [editorHeight, setEditorHeight] = useState(40)

  const placeholder = 'some placeholder'
  const scrollView = useRef<ScrollView | null>(null)

  const onBlur = () => {
    // toggle editor
    console.log('onBlur()')
  }

  const onChange = (event) => {
    console.log('onChange()', event.current)
  }

  const onChangeText = (text) => {
    setInputText(text)
    updateDisplayText()
    const foundMention = findMentionMatches(text)

    console.log('foundMention', foundMention)

    if (foundMention?.replaceableString?.charAt(foundMention?.replaceableString?.length - 1) === ' ') {
      const newMentions = [...mentions, foundMention]
      setMentions(newMentions)
    }
  }

  useEffect(() => {
    updateDisplayText()
    const saveText = getTextWithInfo()
    console.log('### text to save:', saveText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentions])

  const getTextWithInfo = () => {
    const newFormattedText = mentions.reduce((previousValue, currentValue) => {
      const newTExt = previousValue.replace(
        currentValue.replaceableString,
        `[${currentValue.replaceableString}](${'123'}) `
      )
      return newTExt
    }, inputText)
    return newFormattedText
  }

  const updateDisplayText = () => {
    const newFormattedText = mentions.reduce((previousValue, currentValue) => {
      const newTExt = previousValue.replace(currentValue.replaceableString, currentValue.matchingString)
      return newTExt
    }, inputText)

    setFormattedText(newFormattedText)
    return newFormattedText
  }

  const handleSelectionChange = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    const newSelection = event.nativeEvent.selection
    if (newSelection.end === newSelection.start) return

    console.log('handleSelectionChange() old:', JSON.stringify(selection))

    const newSelc = { ...event.nativeEvent.selection }
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

  const onContentSizeChange = (event) => {
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
      <ScrollView
        ref={scrollView}
        onContentSizeChange={() => {
          // scrollView?.current?.scrollToEnd({ animated: true })
        }}
        style={[styles.scrollContainer, {}]}
      >
        {/* <View style={[]}> */}
        <View style={[styles.formmatedTextWrapper]}>
          {formattedText !== '' ? (
            <Text style={[styles.formmatedText]}>{formattedText}</Text>
          ) : (
            <Text style={[styles.placeholderText]}>{placeholder}</Text>
          )}
        </View>
        <TextInput
          // ref={input => props.onRef && props.onRef(input)}
          // style={[styles.input, { height: editorHeight }]}
          multiline
          autoFocus
          placeholder={'some placeholder'}
          numberOfLines={1}
          value={inputText}
          onBlur={onBlur}
          onChange={onChange}
          onChangeText={onChangeText}
          // selection={selection}
          selectionColor={'#0f0'}
          onSelectionChange={handleSelectionChange}
          style={[styles.input, { height: editorHeight }]}
          onContentSizeChange={onContentSizeChange}
          scrollEnabled={false}
        />
        {/* </View> */}
      </ScrollView>
    </View>
  )
}

export default HoliRichInput

const styles = StyleSheet.create({
  container: {
    width: 300,
    alignSelf: 'center',
  },
  scrollContainer: {
    alignSelf: 'stretch',
    position: 'relative',
    minHeight: 40,
    maxHeight: 240,
    borderWidth: 1,
    borderColor: '#0f0',
  },
  input: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    paddingHorizontal: 20,
    minHeight: 40,
    // position: 'absolute',
    // top: 0,
    // color: 'transparent',
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: 'pink',
    // resizeMode: 'auto',
  },
  formmatedTextWrapper: {
    minHeight: 40,
    // position: 'absolute',
    // top: 0,
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '100%',
  },
  formmatedText: {
    fontSize: 16,
    fontWeight: '400',
  },
  mention: {
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'rgba(36, 77, 201, 0.05)',
    color: '#244dc9',
  },
  placeholderText: {
    color: 'rgba(0, 0, 0, 0.1)',
    fontSize: 16,
  },
})
