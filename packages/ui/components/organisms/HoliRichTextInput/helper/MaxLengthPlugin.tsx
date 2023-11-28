/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** This MaxLengthPlugin originally comes from the lexical-playground and was
 * not added to the lexical-react library. you can find more information about it here:
 * https://github.com/facebook/lexical/pull/2254/files#diff-25d2293b1304f0ece2e1c6fc8af68c950ecb89753d162d8e3d56fc44ff59381a
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { trimTextContentFromAnchor } from '@lexical/selection'
import { $getSelection, $isRangeSelection, RootNode } from 'lexical'
import { useEffect } from 'react'

export function MaxLengthPlugin({ maxLength }: { maxLength: number }): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return
      }
      const prevTextContent = editor.getEditorState().read(() => rootNode.getTextContent())
      const textContent = rootNode.getTextContent()
      if (prevTextContent !== textContent) {
        const textLength = textContent.length
        const delCount = textLength - maxLength
        const anchor = selection.anchor

        if (delCount > 0) {
          trimTextContentFromAnchor(editor, anchor, delCount)
        }
      }
    })
  }, [editor, maxLength])

  return null
}
