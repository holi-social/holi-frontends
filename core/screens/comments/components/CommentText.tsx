import React from 'react'

import { Comment } from '@holi/core/screens/comments/types'
import { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

type CommentTextProps = HoliTextProps & {
  comment: Comment
  linkMentionsToProfile?: boolean
}

const CommentText = ({ comment, ...textProps }: CommentTextProps) => (
  <HoliRichTextOutput text={comment.text} users={comment.mentions || []} {...textProps} allowAllLinks />
)

export default CommentText
