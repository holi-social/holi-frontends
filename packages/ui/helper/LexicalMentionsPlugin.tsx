import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin,
  QueryMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { TextNode } from 'lexical'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { findUserByName } from '@holi/ui/helper/richText'
import { findMentionMatches } from '@holi/ui/helper/richText'
import type { SuggestionItem } from '@holi/ui/helper/richText'
// import { useDebounce } from 'lexical/packages/lexical-playground/src/plugins/CodeActionMenuPlugin/utils'
import { useDebounce } from '@holi/ui/helper/useDebounce'

import { $createMentionNode, MENTION_DATA_ATTRIBUTE } from './LexicalMentionNode'
import LexicalMentionsDropdown from './LexicalMentionsDropdown'
import { MentionTypeaheadOption } from './LexicalMentionsDropdown'

const MAX_SUGGESTION_OPTIONS = 5

const mentionsCache = new Map()

export const getPureTextFromHtml = (htmlString: string): string => {
  if (!document) throw new Error('[LexicalMentionsPlugin] No web context.')
  const ele = document.createElement('div')
  ele.innerHTML = htmlString.replaceAll('<br>', '[br]')
  return ele.textContent?.replaceAll('[br]', '\n') || ''
}

const htmlNode = (match?: string) => {
  if (!match) return ''
  if (match === ' ') return ' '
  return `<span>${match}</span>`
}
const mentionNode = (usersList: SuggestionItem[], match?: string) => {
  if (!match) return ''
  const userId = match.slice(1)
  const userName = usersList.find((user) => user.id === userId)?.name || ''
  // TODO: reuse $createMentionNode !!
  // return $createMentionNode(userName, userId, `@${userName}`)
  return `<span ${MENTION_DATA_ATTRIBUTE}="${userId}">${userName}</span>`
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

// TODO: FIXME: This is dummy !!!!!!!
// https://lexical.dev/docs/concepts/serialization
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

const useMentionLookupService = (mentionString: string | null) => {
  const [results, setResults] = useState<Array<SuggestionItem>>([])

  const debouncedSearch: (keyword: string) => void = useDebounce((keyword: string) => {
    setTimeout(() => {
      const results = findUserByName(keyword)
      mentionsCache.set(mentionString, results)
      setResults(results)
    }, 50)
  }, 500)

  useEffect(() => {
    const cachedResults = mentionsCache.get(mentionString)

    if (mentionString == null) {
      setResults([])
      return
    }

    if (cachedResults === null) {
      return
    } else if (cachedResults !== undefined) {
      setResults(cachedResults)
      return
    }

    mentionsCache.set(mentionString, null)

    debouncedSearch(mentionString)
  }, [mentionString, debouncedSearch])

  return results
}

const LexicalMentionsPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = useState<string | null>(null)
  const results = useMentionLookupService(queryString)

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  })

  const optionsList = useMemo(
    () =>
      results
        .map((item) => new MentionTypeaheadOption(item.id, item.name, <i className="icon user" />))
        .slice(0, MAX_SUGGESTION_OPTIONS),
    [results]
  )

  // replace in editor
  const replaceTextWithMentionNode = useCallback(
    (selectedOption: MentionTypeaheadOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.name, selectedOption.id, `@${selectedOption.name}`)
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode)
        }
        mentionNode.select()
        closeMenu()
      })
    },
    [editor]
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

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={replaceTextWithMentionNode}
      triggerFn={checkForMentionMatch}
      options={optionsList}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <LexicalMentionsDropdown
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

export default LexicalMentionsPlugin
