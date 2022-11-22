/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Spread } from 'lexical'
import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  TextNode,
} from 'lexical'

import { colors } from '@holi/ui/styles/globalVars'

export type SerializedMentionNode = Spread<
  {
    userId: string
    userName: string
    displayString: string
    type: 'mention'
    version: 1
  },
  SerializedTextNode
>

export const MENTION_DATA_ATTR_USER_ID = 'data-user-id'
export const MENTION_DATA_ATTR = 'data-lexical-mention'

export class HoliLexicalMentionsPluginNode extends TextNode {
  __userId: string
  __userName: string
  __displayString: string

  static getType(): string {
    return 'mention'
  }

  static clone(node: HoliLexicalMentionsPluginNode): HoliLexicalMentionsPluginNode {
    return new HoliLexicalMentionsPluginNode(
      node.__userName,
      node.__userId,
      node.__displayString,
      node.__text,
      node.__key
    )
  }

  static importJSON(serializedNode: SerializedMentionNode): HoliLexicalMentionsPluginNode {
    const node = $createMentionNode(serializedNode.userName, serializedNode.userId, serializedNode.displayString)
    node.setTextContent(serializedNode.text)
    console.log('[SuggNode] text:', serializedNode.text)
    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)
    return node
  }

  constructor(userName: string, userId: string, displayString?: string, text?: string, key?: NodeKey) {
    super(text ?? userName, key)
    this.__userId = userId
    this.__userName = userName
    this.__displayString = displayString || userName
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      userId: this.__userId,
      userName: this.__userName,
      displayString: this.__displayString,
      type: 'mention',
      version: 1,
    }
  }

  // display element in input field
  createDOM(config: EditorConfig): HTMLElement {
    const mentionElement = super.createDOM(config)
    mentionElement.setAttribute(MENTION_DATA_ATTR_USER_ID, this.__userId)
    mentionElement.style.cssText = `color: ${colors.fontColorHighlighted}`
    mentionElement.className = 'holi-mention'
    // TODO: updating the visible string in the input field causes errors:
    // 1. after replacement cursor is not behind the new string
    // 2. if start typing directly, the replaced mention disappears
    // mentionElement.textContent = this.__displayString
    return mentionElement
  }

  // export for save
  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')
    element.setAttribute(MENTION_DATA_ATTR_USER_ID, this.__text)
    element.setAttribute('MENTION_DATA_ATTR', 'true')
    element.textContent = `@${this.__userId}`
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('MENTION_DATA_ATTR')) {
          return null
        }
        return {
          conversion: $convertDomInJsonElement,
          priority: 1,
        }
      },
    }
  }

  isTextEntity(): true {
    return true
  }
}

export const $createMentionNode = (
  userName: string,
  userId: string,
  displayString?: string
): HoliLexicalMentionsPluginNode => {
  const mentionNode = new HoliLexicalMentionsPluginNode(userName, userId, displayString)
  mentionNode.setMode('segmented').toggleDirectionless()
  return mentionNode
}

export const $isMentionNode = (node: LexicalNode | null | undefined): node is HoliLexicalMentionsPluginNode => {
  return node instanceof HoliLexicalMentionsPluginNode
}

export const $convertDomInJsonElement = (domNode: HTMLElement): DOMConversionOutput | null => {
  const textContent = domNode.textContent
  const userId = domNode.getAttribute(MENTION_DATA_ATTR_USER_ID)

  if (textContent !== null && userId) {
    const node = $createMentionNode(textContent, userId, `@${textContent}`)
    return {
      node,
    }
  } else {
    console.error(
      '[HoliLexicalMentionsPluginNode] $convertDomInJsonElement() Couldnt convert element. Data missing.',
      textContent,
      userId
    )
  }

  return null
}
