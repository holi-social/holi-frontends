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

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { addDistinctItem, findMentionMatches, findUserByName } from '@holi/ui/helper/richText'

export type Mention = {
  leadOffset: number
  matchingString: string
  replaceableString: string
}

export type User = {
  id: string
  name: string
}

const HoliRichInput: React.VFC = () => {
  const [pureText, setPureText] = useState('')
  const [formerText, setFormerText] = useState('')
  const [inputText, setInputText] = useState<string | JSX.Element | (string | JSX.Element)[]>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [richText, setRichText] = useState('')
  const [currentMention, setCurrentMention] = useState<Mention>()
  // const [mentions, setMentions] = useState<Mention[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [suggestions, setSuggestions] = useState<User[]>([])
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
    console.log('onChangeText() ..')

    const prevText = formerText

    if (text.length < prevText.length) {
      // user is deleting
      const charDeleted = Math.abs(text.length - prevText.length)
      const totalSelection = {
        start: selection.start,
        end: charDeleted > 1 ? selection.start + charDeleted : selection.start,
      }
      console.log('@@ user deletes at', JSON.stringify(selection), JSON.stringify(totalSelection))
    } else if (text.length > prevText.length) {
      // user adds text
      console.log('@@ user adds at', JSON.stringify(selection))
    } else if (text.length === prevText.length) {
      // user replaces text
      console.log('@@ user replaces at', JSON.stringify(selection))
    }

    setPureText(text)
    // setInputText(highlightMentions(text))

    // const apiText = getFormattedText()
    // setRichText(apiText)

    const foundMention = findMentionMatches(text)

    if (foundMention) {
      console.log('foundMention', foundMention)
      setCurrentMention(foundMention)
      const foundUsers = findUserByName(foundMention.matchingString)
      setSuggestions(foundUsers)
    }

    // This is a workaround (select by hitting enter): TODO: select from dropdown
    // if (foundMention?.replaceableString?.charAt(foundMention?.replaceableString?.length - 1) === ' ') {
    //   addMention(foundMention)
    // }

    // TODO: remove mention

    // TODO: replace mention
    setFormerText(text)
  }

  // useEffect(() => {
  //   const apiText = getFormattedText()
  //   setRichText(apiText)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mentions])

  // const highlightMentions = (text: string): string | JSX.Element | (string | JSX.Element)[] => {
  //   return text.split(/(\s)/g).map((item) => {
  //     const foundMention = findMentionMatches(item)
  //     if (foundMention) {
  //       return hightlightMention(foundMention)
  //     }
  //     return item
  //   })
  // }

  // const hightlightMention = (mention: Mention) => {
  //   return (
  //     <Text key={mention.matchingString} style={{ color: 'blue' }}>
  //       {mention.replaceableString}
  //     </Text>
  //   )
  // }

  // const getFormattedText = () => {
  //   if (mentions.length < 1) {
  //     return pureText
  //   }
  //   const newFormattedText = mentions.reduce((previousValue, currentValue) => {
  //     const toReplace = currentValue.replaceableString
  //     const replacement = `[${toReplace}:${currentValue.matchingString}] `
  //     const newTExt = previousValue.replace(toReplace, replacement)
  //     return newTExt
  //   }, pureText)
  //   return newFormattedText
  // }

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

  const onSelectUser = (user: User) => {
    console.log('########### select user', user, 'currentMention:', currentMention)
    // set selection
    // close suggetion list
    // addMention(foundMention)
    const newSelectedUsers = addDistinctItem(selectedUsers, user, 'id')
    console.log('#### new selected users: ', newSelectedUsers)
    setSelectedUsers(newSelectedUsers as User[])
    setSuggestions([])
    replaceInInputText(user)
  }

  const replaceInInputText = (user: User) => {
    const newPureText = pureText.replace(currentMention?.replaceableString || '', `@${user.id}`)
    setPureText(newPureText)
  }

  useEffect(() => {
    hightlightAllMentionedUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pureText])

  const hightlightAllMentionedUsers = () => {
    console.log('** highlight all in pure: ', pureText)
    const newInputText = pureText.split(/(\s)/g).map((word) => {
      const foundMentionedUser = selectedUsers.find((user) => `@${user.id}` === word)
      if (foundMentionedUser) {
        return hightlightMention2(foundMentionedUser)
      }
      return word
    })
    setInputText(newInputText)
  }

  const hightlightMention2 = (user: User) => {
    return (
      <Text key={user.id} style={{ color: 'blue' }}>
        {user.name}
      </Text>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <ScrollView
          ref={scrollView}
          onContentSizeChange={() => {
            // scrollView?.current?.scrollToEnd({ animated: true })
          }}
          style={[styles.scrollContainer, {}]}
        >
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
          {/* {(!inputText || inputText.length < 0) && <Text style={[styles.placeholderText]}>{placeholder}</Text>} */}
        </ScrollView>
        <View style={styles.suggestionList}>
          {suggestions.map((suggestedUser) => (
            <HoliButton
              key={suggestedUser.id}
              label="xxx"
              transparent
              style={styles.suggestionItem}
              onPress={() => onSelectUser(suggestedUser)}
            >
              {suggestedUser.name}
            </HoliButton>
          ))}
        </View>
      </View>

      {/* pure text */}
      <Text>Pure: {pureText}</Text>
      {/* api formatted text */}
      <Text>API: {richText}</Text>
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
  inputContainer: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 20,
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
    paddingHorizontal: 10,
    minHeight: 80,
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: 'pink',
    // resizeMode: 'auto',
  },
  formmatedTextWrapper: {
    minHeight: 80,
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
  suggestionList: {
    position: 'absolute',
    // TODO: find cursor position
    top: -10,
    right: -10,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  suggestionItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
})
