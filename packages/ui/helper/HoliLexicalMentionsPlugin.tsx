import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin,
  QueryMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { TextNode } from 'lexical'
import { useCallback, useMemo, useState } from 'react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { findMentionMatches } from '@holi/ui/helper/richText'
import type { SuggestionItem } from '@holi/ui/helper/richText'

import HoliLexicalMentionsDropdown from './HoliLexicalMentionsPlugin.dropdown'
import DropdownOption from './HoliLexicalMentionsPlugin.dropdownOption'
import { $createMentionNode, MENTION_DATA_ATTR } from './HoliLexicalMentionsPlugin.node'
import useDebouncedQuery from './HoliLexicalMentionsPlugin.query'

const MAX_SUGGESTION_OPTIONS = 5

const HoliLexicalMentionsPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = useState<string | null>(null)
  const results = useDebouncedQuery(queryString)

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  })

  const optionsList = useMemo(
    () =>
      // TODO: HoliUserAvatar
      results
        .map((item) => new DropdownOption(item.id, item.name, <i className="icon user" />))
        .slice(0, MAX_SUGGESTION_OPTIONS),
    [results]
  )

  // check for mentions
  const checkForMentionMatch = useCallback(
    (text: string) => {
      const mentionMatch = findMentionMatches(text) as QueryMatch
      const slashMatch = checkForSlashTriggerMatch(text, editor)
      return !slashMatch && mentionMatch ? mentionMatch : null
    },
    [checkForSlashTriggerMatch, editor]
  )

  // replace in editor
  const replaceTextWithMentionNode = useCallback(
    (selectedOption: DropdownOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const displayString = `@${selectedOption.name}`
        const mentionNode = $createMentionNode(selectedOption.name, selectedOption.id, displayString)
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode)
        }
        // mentionNode.select(displayString.length, displayString.length)
        mentionNode.select()
        closeMenu()
      })
    },
    [editor]
  )

  return (
    <LexicalTypeaheadMenuPlugin<DropdownOption>
      onQueryChange={setQueryString}
      onSelectOption={replaceTextWithMentionNode}
      triggerFn={checkForMentionMatch}
      options={optionsList}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <HoliLexicalMentionsDropdown
                optionslist={optionsList}
                selectedIndex={selectedIndex}
                onClick={(i, option) => {
                  setHighlightedIndex(i)
                  selectOptionAndCleanUp(option)
                }}
                onMouseEnter={(i) => {
                  setHighlightedIndex(i)
                }}
              />,
              anchorElementRef.current
            )
          : null
      }
    />
  )
}

export default HoliLexicalMentionsPlugin

/**
 * Get pure text from html
 *
 * E.g. '<p dir="ltr"><span>Hello </span><span data-user-id="Uschi Meyer" data-lexical-mention="true">@0001</span></p>'
 *  => 'Hello @0001'
 */
export const getPureTextFromHtml = (htmlString: string): string => {
  if (!document) throw new Error('[HoliLexicalMentionsPlugin] No web context.')
  const ele = document.createElement('div')
  ele.innerHTML = htmlString.replaceAll('<br>', '[br]')
  return ele.textContent?.replaceAll('[br]', '\n') || ''
}

/**
 * Get simple HTML from string with mentions
 *
 * E.g. 'Hello @222222 and @666666'
 *  => '<p><span>Hello </span><span data-user-id="0001">Uschi Meyer</span><span> and </span><span data-user-id="0002">Paul Müller</span></p>'
 */
const htmlNode = (match?: string) => {
  if (!match) return ''
  if (match === ' ') return ' '
  return `<span>${match}</span>`
}
const mentionNode = (usersList: SuggestionItem[], match?: string) => {
  if (!match || !usersList) return ''
  const userId = match.slice(1)
  const userName = usersList.find((user) => user.id === userId)?.name || ''
  // TODO: reuse $createMentionNode !!
  // return $createMentionNode(userName, userId, `@${userName}`)
  return `<span ${MENTION_DATA_ATTR}="${userId}">${userName}</span>`
}
export const getHtmlFromPureText = (textWithMentions: string, usersList: SuggestionItem[]): string | undefined => {
  const regex = /@\w*/g
  const allMentions = textWithMentions.match(regex)
  const textParts = textWithMentions.split(regex)
  const textWithReplacedParts = textParts.reduce(
    (accumulator, curr, index) => accumulator + htmlNode(curr) + mentionNode(usersList, allMentions?.[index]),
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
const createJsonNode = (type: 'root' | 'paragraph' | 'text', text?: string) => {
  return {
    direction: 'ltr',
    format: '',
    indent: 0,
    type: type,
    version: 1,
    ...(type === 'text' && { text, mode: 'normal' }),
  }
}
export const createJsonFromPureText = (textWithMentions: string, usersList: SuggestionItem[]) => {
  const regex = /@\w*/g
  const allMentions = textWithMentions.match(regex)
  const textParts = textWithMentions.split(regex)
  const rootNode = createJsonNode('root')
  const pNode = createJsonNode('paragraph')
  const children = []
  textParts.map((part, index) => {
    if (part && part !== '') {
      const textNode = createJsonNode('text', part)
      children.push(textNode)
    }
    const mentionString = allMentions?.[index]
    if (mentionString) {
      const userId = mentionString.slice(1)
      const userName = usersList.find((user) => user.id === userId)?.name || ''
      const mentionNode = $createMentionNode(userName, userId, `@${userName}`)
      children.push(mentionNode)
    }
  })
  pNode.children = children
  rootNode.children = [pNode]
  return rootNode
}
