import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import HoliTranslate from '@holi/core/components/HoliTranslate'
import { Comment } from '@holi/core/screens/comments/types'
import { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

type CommentTextProps = HoliTextProps & {
  comment: Comment
  linkMentionsToProfile?: boolean
}

const CommentText = ({ comment, ...textProps }: CommentTextProps) => {
  const { i18n } = useTranslation()

  const [text, setText] = useState(comment.text)
  const isTranslatable = comment.language && comment.language !== i18n.language

  return (
    <>
      <HoliRichTextOutput text={text} users={comment.mentions || []} {...textProps} allowAllLinks />
      {isTranslatable && (
        <HoliTranslate
          primaryText={{
            text,
            setText,
          }}
        />
      )}
    </>
  )
}

export default CommentText
