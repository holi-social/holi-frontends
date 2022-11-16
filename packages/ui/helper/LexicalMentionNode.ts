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

export const MENTION_DATA_ATTRIBUTE = 'data-user-id'

const convertMentionElement = (domNode: HTMLElement): DOMConversionOutput | null => {
  const textContent = domNode.textContent
  const userId = domNode.getAttribute(MENTION_DATA_ATTRIBUTE)

  if (textContent !== null && userId) {
    const node = $createMentionNode(textContent, userId)
    return {
      node,
    }
  } else {
    console.error(
      '[LexicalMentionNode] convertMentionElement() Couldnt convert element. Data missing.',
      textContent,
      userId
    )
  }

  return null
}

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)'
export class LexicalMentionNode extends TextNode {
  __userId: string
  __userName: string
  __displayString: string

  static getType(): string {
    return 'mention'
  }

  static clone(node: LexicalMentionNode): LexicalMentionNode {
    return new LexicalMentionNode(node.__userName, node.__userId, node.__displayString, node.__text, node.__key)
  }

  static importJSON(serializedNode: SerializedMentionNode): LexicalMentionNode {
    const node = $createMentionNode(serializedNode.displayString, serializedNode.userId)
    node.setTextContent(serializedNode.text)
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
    mentionElement.setAttribute(MENTION_DATA_ATTRIBUTE, this.__userId)
    mentionElement.style.cssText = mentionStyle
    mentionElement.className = 'mention'
    return mentionElement
  }

  // export for save
  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')
    element.setAttribute(MENTION_DATA_ATTRIBUTE, this.__text)
    element.setAttribute('data-lexical-mention', 'true')
    element.textContent = `@${this.__userId}`
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        }
      },
    }
  }

  isTextEntity(): true {
    return true
  }
}

export const $createMentionNode = (userName: string, userId: string, displayString?: string): LexicalMentionNode => {
  const mentionNode = new LexicalMentionNode(userName, userId, displayString)
  mentionNode.setMode('segmented').toggleDirectionless()
  return mentionNode
}

export const $isMentionNode = (node: LexicalNode | null | undefined): node is LexicalMentionNode => {
  return node instanceof LexicalMentionNode
}
