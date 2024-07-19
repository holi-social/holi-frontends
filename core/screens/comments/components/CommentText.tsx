import React, { useState } from 'react'

import HoliTranslate from '@holi/core/components/HoliTranslate'
import { Comment } from '@holi/core/screens/comments/types'
import { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

type CommentTextProps = HoliTextProps & {
  comment: Comment
  linkMentionsToProfile?: boolean
}

const CommentText = ({ comment, ...textProps }: CommentTextProps) => {
  const [text, setText] = useState(comment.text)
  return (
    <>
      <HoliRichTextOutput text={text} users={comment.mentions || []} {...textProps} allowAllLinks />
      <HoliTranslate
        primaryText={{
          text,
          setText,
        }}
      />
    </>
  )
}

export default CommentText
