import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { QueryMatch, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { $getSelection, $isRangeSelection, LexicalEditor, RangeSelection } from 'lexical'
import { useCallback, useEffect, useMemo, useState } from 'react'
import React from 'react'

import { useSafeDispatch } from '@holi/core/helpers'
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

  const debouncedSearch: (keyword?: string) => void = useDebounce((keyword?: string) => {
    if (!keyword || keyword.length < minSearchChars) return setResults([])
    findUsersByName(keyword).then(setSafeResult)
  }, debounceDelay)

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  })

  // check for mentions
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

  // const isSelectionOnEntityBoundary = (editor: LexicalEditor, offset: number): boolean => {
  //   if (offset !== 0) {
  //     return false
  //   }
  //   return editor.getEditorState().read(() => {
  //     const selection = $getSelection()
  //     if ($isRangeSelection(selection)) {
  //       const anchor = selection.anchor
  //       const anchorNode = anchor.getNode()
  //       const prevSibling = anchorNode.getPreviousSibling()
  //       return $isTextNode(prevSibling) && prevSibling.isTextEntity()
  //     }
  //     return false
  //   })
  // }

  // const tryToPositionRange = (leadOffset: number, range: Range): boolean => {
  //   const domSelection = window.getSelection()
  //   if (domSelection === null || !domSelection.isCollapsed) {
  //     return false
  //   }
  //   const anchorNode = domSelection.anchorNode
  //   const startOffset = leadOffset
  //   const endOffset = domSelection.anchorOffset

  //   if (anchorNode == null || endOffset == null) {
  //     return false
  //   }

  //   try {
  //     range.setStart(anchorNode, startOffset)
  //     range.setEnd(anchorNode, endOffset)
  //   } catch (error) {
  //     return false
  //   }

  //   return true
  // }

  useEffect(() => {
    const updateListener = () => {
      editor.getEditorState().read(() => {
        const range = document.createRange()
        const selection = $getSelection()
        const text = getQueryTextForSearch(editor)

        console.log('range:', range)
        console.log('selection:', selection)
        console.log('text:', text)

        if (!$isRangeSelection(selection) || !selection.isCollapsed() || text === null || range === null) {
          // closeTypeahead()
          setSafeResult([])
          return
        }

        const match = checkForMentionMatch(text)
        // search for mentions
        debouncedSearch(match ? match.matchingString : undefined)

        // if (
        //   match !== null &&
        //   !isSelectionOnEntityBoundary(editor, match.leadOffset)
        // ) {
        //   const isRangePositioned = tryToPositionRange(match.leadOffset, range);
        //   if (isRangePositioned !== null) {
        //     startTransition(() =>
        //       openTypeahead({
        //         getRect: () => range.getBoundingClientRect(),
        //         match,
        //       }),
        //     );
        //     return;
        //   }
        // }
        // closeTypeahead();
      })
    }

    const removeUpdateListener = editor.registerUpdateListener(updateListener)

    return () => {
      removeUpdateListener()
    }
  }, [editor, checkForMentionMatch, debouncedSearch, getQueryTextForSearch, setSafeResult])

  const optionsList = useMemo(
    () => results.slice(0, maxSuggestionOptions).map((user) => new DropdownOption(user)),
    [results, maxSuggestionOptions]
  )

  // replace in editor
  // const replaceTextWithMentionNode = useCallback(
  //   (selectedOption: DropdownOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
  //     editor.update(() => {
  //       const displayString = `@${selectedOption.user.fullName}`
  //       const mentionNode = $createMentionNode(selectedOption.user.fullName, selectedOption.user.id, displayString)
  //       if (nodeToReplace) {
  //         nodeToReplace.replace(mentionNode)
  //       }
  //       mentionNode.select()
  //       closeMenu()
  //     })
  //   },
  //   [editor]
  // )

  return (
    <HoliLexicalMentionsDropdown
      optionslist={optionsList}
      selectedIndex={0}
      onClick={() => {
        // setHighlightedIndex(i)
        // selectOptionAndCleanUp(option)
      }}
      onMouseEnter={() => {
        // setHighlightedIndex(i)
      }}
    />
    // <LexicalTypeaheadMenuPlugin<DropdownOption>
    //   onQueryChange={debouncedSearch}
    //   onSelectOption={replaceTextWithMentionNode}
    //   triggerFn={checkForMentionMatch}
    //   options={optionsList}
    //   menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
    //     anchorElementRef.current && results.length
    //       ? ReactDOM.createPortal(
    //           <HoliLexicalMentionsDropdown
    //             optionslist={optionsList}
    //             selectedIndex={selectedIndex}
    //             onClick={(i, option) => {
    //               setHighlightedIndex(i)
    //               selectOptionAndCleanUp(option)
    //             }}
    //             onMouseEnter={(i) => {
    //               setHighlightedIndex(i)
    //             }}
    //           />,
    //           anchorElementRef.current
    //         )
    //       : null
    //   }
    // />
  )
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
