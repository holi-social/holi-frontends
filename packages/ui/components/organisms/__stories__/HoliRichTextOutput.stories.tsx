import { ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

const DUMMY_COMMENT = {
  id: '',
  text: 'Hello @5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0 and @5dbeb15e-1fac-4292-96fc-9fbe2e6edbb4, how are you?',
  mentions: [
    {
      id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
      fullName: 'Uschi Meyer',
      avatarLabel: '',
      avatarDefaultColor: '',
    },
    {
      id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb4',
      fullName: 'Manni Müller',
      avatarLabel: '',
      avatarDefaultColor: '',
    },
  ],
}

export default {
  title: 'Organisms/HoliRichTextOutput',
  component: HoliRichTextOutput,
  parameters: {
    docs: {
      description: {
        component: 'Replaces user mentions in post text',
      },
    },
  },
}

export const Example: ComponentStory<typeof HoliRichTextOutput> = ({ ...args }) => (
  <>
    <View style={{ marginBottom: 20, flexDirection: 'row' }}>
      <HoliText style={{ color: colors.fontColorGrey, marginRight: 10 }}>ORIG TEXT: </HoliText>
      <HoliText style={{}}>{DUMMY_COMMENT.text}</HoliText>
    </View>

    <HoliText style={{ color: colors.fontColorGrey, marginRight: 10 }}>OUTPUT: </HoliText>
    <HoliRichTextOutput text={args.text} users={args.users} />
  </>
)
Example.argTypes = {
  text: { description: 'The input text including user mentions' },
  users: { description: 'List of users which are mentioned within the text' },
}

Example.args = {
  text: DUMMY_COMMENT.text,
  users: DUMMY_COMMENT.mentions,
}
