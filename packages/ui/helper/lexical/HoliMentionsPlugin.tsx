import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { QueryMatch, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_NORMAL,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  LexicalEditor,
  RangeSelection,
  TextNode,
} from 'lexical'
import { useCallback, useEffect, useState } from 'react'
import React from 'react'

import { useSafeDispatch } from '@holi/core/helpers'
import { usePortals } from '@holi/core/provider/PortalProvider'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliLexicalMentionsDropdown from '@holi/ui/helper/lexical/HoliMentionsPlugin.dropdown'
import DropdownOption from '@holi/ui/helper/lexical/HoliMentionsPlugin.dropdownOption'
import { $createMentionNode, MENTION_DATA_ATTR } from '@holi/ui/helper/lexical/HoliMentionsPlugin.node'
import { findMentionMatches } from '@holi/ui/helper/richText'
import { useDebounce } from '@holi/ui/helper/useDebounce'

export type HoliMentionsPluginProps = {
  minSearchChars: number
  maxSuggestionOptions: number
  debounceDelay: number
  findUsersByName: (substring: string) => Promise<User[]>
}

const HoliMentionsPlugin: React.VFC<HoliMentionsPluginProps> = ({
  minSearchChars,
  maxSuggestionOptions,
  debounceDelay,
  findUsersByName,
}): JSX.Element | null => {
  const [editor] = useLexicalComposerContext()
  const [results, setResults] = useState<Array<User>>([])
  const setSafeResult = useSafeDispatch(setResults)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const { teleport } = usePortals()

  const debouncedSearch: (keyword?: string) => void = useDebounce((keyword?: string) => {
    if (!keyword || keyword.length < minSearchChars) return setResults([])
    findUsersByName(keyword)
      .then(setSafeResult)
      .catch((error) => {
        console.error('[HoliMentionsPlugin] ', error)
        setSafeResult([])
      })
      .finally(() => setSelectedOptionIndex(0))
  }, debounceDelay)

  // check input text for slash
  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  })

  // check input text for mentions
  const checkForMentionMatch = useCallback(
    (text: string) => {
      const mentionMatch = findMentionMatches(text) as QueryMatch
      const slashMatch = checkForSlashTriggerMatch(text, editor)
      return !slashMatch && mentionMatch ? mentionMatch : null
    },
    [checkForSlashTriggerMatch, editor]
  )

  const getTextUpToAnchor = (selection: RangeSelection): string | null => {
    const anchor = selection.anchor
    if (anchor.type !== 'text') {
      return null
    }
    const anchorNode = anchor.getNode()
    if (!anchorNode.isSimpleText()) {
      return null
    }
    const anchorOffset = anchor.offset
    return anchorNode.getTextContent().slice(0, anchorOffset)
  }

  const getQueryTextForSearch = useCallback((editor: LexicalEditor): string | null => {
    let text = null
    editor.getEditorState().read(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return
      }
      text = getTextUpToAnchor(selection)
    })
    return text
  }, [])

  const splitNodeContainingQuery = useCallback((editor: LexicalEditor, match: QueryMatch): TextNode | null => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
      return null
    }
    const anchor = selection.anchor
    if (anchor.type !== 'text') {
      return null
    }
    const anchorNode = anchor.getNode()
    if (!anchorNode.isSimpleText()) {
      return null
    }
    const selectionOffset = anchor.offset
    const textContent = anchorNode.getTextContent().slice(0, selectionOffset)
    const characterOffset = match.replaceableString.length
    const queryOffset = getFullMatchOffset(textContent, match.matchingString, characterOffset)
    const startOffset = selectionOffset - queryOffset
    if (startOffset < 0) {
      return null
    }
    let newNode
    if (startOffset === 0) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[newNode] = anchorNode.splitText(selectionOffset)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[, newNode] = anchorNode.splitText(startOffset, selectionOffset)
    }

    return newNode
  }, [])

  const selectOptionAndCleanUp = useCallback(
    (selectedOption: DropdownOption) => {
      editor.update(() => {
        const text = getQueryTextForSearch(editor)

        const nodeToReplace = splitNodeContainingQuery(editor, {
          leadOffset: text?.length || 0,
          matchingString: text || '',
          replaceableString: text || '',
        })

        editor.update(() => {
          const displayString = `@${selectedOption.user.fullName}`
          const mentionNode = $createMentionNode(selectedOption.user.fullName, selectedOption.user.id, displayString)
          if (nodeToReplace) {
            nodeToReplace.replace(mentionNode)
          }
          mentionNode.select()
        })
      })
    },
    [editor, getQueryTextForSearch, splitNodeContainingQuery]
  )

  const onEnter = useCallback(
    (event: KeyboardEvent | null) => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return false
      }

      const selectedOption = results[selectedOptionIndex]
      if (selectedOption) {
        selectOptionAndCleanUp(new DropdownOption(selectedOption))
        event?.preventDefault()
        event?.stopPropagation()
        return true // stops propagation
      }

      return false
    },
    [selectedOptionIndex, selectOptionAndCleanUp, results]
  )

  const onArrowUp = useCallback(
    (event: KeyboardEvent | null) => {
      const newIndex = selectedOptionIndex <= 0 ? 0 : selectedOptionIndex - 1
      setSelectedOptionIndex(newIndex)
      event?.preventDefault()
      event?.stopPropagation()
      return true
    },
    [selectedOptionIndex, setSelectedOptionIndex]
  )

  const onArrowDown = useCallback(
    (event: KeyboardEvent | null) => {
      const maxIndex = results.length > maxSuggestionOptions ? maxSuggestionOptions : results.length
      const newIndex = selectedOptionIndex >= maxIndex ? maxIndex : selectedOptionIndex + 1
      setSelectedOptionIndex(newIndex)
      event?.preventDefault()
      event?.stopPropagation()
      return true
    },
    [maxSuggestionOptions, results, selectedOptionIndex, setSelectedOptionIndex]
  )

  // on input text
  useEffect(() => {
    const updateListener = () => {
      editor.getEditorState().read(() => {
        const range = document.createRange()
        const selection = $getSelection()
        const text = getQueryTextForSearch(editor)

        if (!$isRangeSelection(selection) || !selection.isCollapsed() || text === null || range === null) {
          setSafeResult([])
          return
        }

        const match = checkForMentionMatch(text)
        debouncedSearch(match ? match.matchingString : undefined)
      })
    }
    const removeUpdateListener = editor.registerUpdateListener(updateListener)

    const stopEnterListener = editor.registerCommand<KeyboardEvent | null>(
      KEY_ENTER_COMMAND,
      onEnter,
      COMMAND_PRIORITY_NORMAL
    )

    const stopArrowUpListener = editor.registerCommand<KeyboardEvent | null>(
      KEY_ARROW_UP_COMMAND,
      onArrowUp,
      COMMAND_PRIORITY_EDITOR
    )

    const stopArrowDownListener = editor.registerCommand<KeyboardEvent | null>(
      KEY_ARROW_DOWN_COMMAND,
      onArrowDown,
      COMMAND_PRIORITY_EDITOR
    )

    return () => {
      removeUpdateListener()
      stopEnterListener()
      stopArrowUpListener()
      stopArrowDownListener()
    }
  }, [
    editor,
    checkForMentionMatch,
    debouncedSearch,
    getQueryTextForSearch,
    setSafeResult,
    onEnter,
    onArrowDown,
    onArrowUp,
  ])

  // on suggestions change
  useEffect(() => {
    const options = results.slice(0, maxSuggestionOptions).map((user) => new DropdownOption(user))
    const optionsElement = (
      <HoliLexicalMentionsDropdown
        optionsList={options}
        selectedIndex={selectedOptionIndex}
        onChooseOption={(i, option) => {
          selectOptionAndCleanUp(option)
        }}
      />
    )
    teleport('suggestions', options.length ? optionsElement : null)
    // `teleport` in the dependencies list causes endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptionIndex, results, maxSuggestionOptions])

  const getFullMatchOffset = (documentText: string, entryText: string, offset: number): number => {
    let triggerOffset = offset
    for (let i = triggerOffset; i <= entryText.length; i++) {
      if (documentText.substr(-i) === entryText.substr(0, i)) {
        triggerOffset = i
      }
    }
    return triggerOffset
  }

  return null
}

export default HoliMentionsPlugin

/**
 * Get pure text from html
 *
 * E.g. '<p dir="ltr"><span>Hello </span><span data-user-id="Uschi Meyer" data-lexical-mention="true">@0001</span></p>'
 *  => 'Hello @0001'
 */
export const $getPureTextFromHtml = (htmlString: string): string => {
  if (!document) throw new Error('[HoliMentionsPlugin] No web context.')
  const ele = document.createElement('div')
  ele.innerHTML = htmlString.replaceAll('<br>', '[br]')
  const pureText = ele.textContent?.replaceAll('[br]', '\n') || ''
  return pureText
}

/**
 * Get simple HTML from string with mentions
 *
 * E.g. 'Hello @222222 and @666666'
 *  => '<p><span>Hello </span><span data-user-id="0001">Uschi Meyer</span><span> and </span><span data-user-id="0002">Paul Müller</span></p>'
 */
const createSpan = (match?: string) => {
  if (!match) return ''
  if (match === ' ') return ' '
  return `<span>${match}</span>`
}
const createMentionSpan = (usersList: User[], match?: string) => {
  if (!match || !usersList) return ''
  const userId = match.slice(1)
  const userName = usersList.find((user) => user.id === userId)?.name || ''
  // TODO: reuse $createMentionNode !!
  // return $createMentionNode(userName, userId, `@${userName}`)
  return `<span ${MENTION_DATA_ATTR}="${userId}">${userName}</span>`
}
export const $getHtmlStringFromPureText = (textWithMentions: string, usersList: User[]): string | undefined => {
  const regex = /@\w*/g
  const allMentions = textWithMentions.match(regex)
  const textParts = textWithMentions.split(regex)
  const textWithReplacedParts = textParts.reduce(
    (accumulator, curr, index) => accumulator + createSpan(curr) + createMentionSpan(usersList, allMentions?.[index]),
    ''
  )
  return textWithReplacedParts && textWithReplacedParts !== '' ? `<p>${textWithReplacedParts}</p>` : ''
}

/**
 *
 * Get JSON from string with mentions
 *
 * TODO: FIXME: This is dummy !!!!!!!
 * https://lexical.dev/docs/concepts/serialization
 *
 * E.g. 'Hello @0001'
 *  => '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Hello ","type":"text","version":1},{"detail":1,"format":0,"mode":"segmented","style":"","text":"Uschi Meyer","type":"mention","version":1,"userId":"0001","userName":"Uschi Meyer","displayString":"@Uschi Meyer"}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
 */
const createNode = (type: 'root' | 'paragraph' | 'text', text?: string) => {
  return {
    direction: 'ltr',
    format: '',
    indent: 0,
    type: type,
    version: 1,
    ...(type === 'text' && { text, mode: 'normal' }),
  }
}
export const $createJsonFromPureText = (textWithMentions: string, usersList: User[]) => {
  const regex = /@\w*/g
  const allMentions = textWithMentions.match(regex)
  const textParts = textWithMentions.split(regex)
  const rootNode = createNode('root')
  const pNode = createNode('paragraph')
  const children = []
  textParts.map((part, index) => {
    if (part && part !== '') {
      const textNode = createNode('text', part)
      children.push(textNode)
    }
    const mentionString = allMentions?.[index]
    if (mentionString) {
      const userId = mentionString.slice(1)
      const userName = usersList.find((user) => user.id === userId)?.fullName || ''
      const mentionNode = $createMentionNode(userName, userId, `@${userName}`)
      children.push(mentionNode)
    }
  })
  pNode.children = children
  rootNode.children = [pNode]
  return rootNode
}
