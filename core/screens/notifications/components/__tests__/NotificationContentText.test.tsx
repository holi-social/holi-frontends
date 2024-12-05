import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { type TextLayoutLine, View } from 'react-native'

import NotificationContentText from '@holi/core/screens/notifications/components/NotificationContentText'

const convertTextLinesToText = (textLines: Pick<TextLayoutLine, 'text'>[]) => {
  return textLines.map((line) => line.text).join('')
}

it('should display truncated and full text from children', async () => {
  const containerTestId = 'notification-content-text-container'
  const notificationContentTextTestId = 'notification-content-text'
  const textLines = [
    {
      text: 'Infinite Scroll. Swipe, swipe, scroll down. Endless feeds without a frown .Likes and hearts and retweets to. ',
    },
    {
      text: 'Endless scrolling, what to do? A world of data, at our fingertips. Information flows, never skips. The internet,',
    },
    {
      text: 'a boundless space. A virtual world we can embrace. From screens to apps, to cloud and more. Technology opens up ',
    },
    {
      text: 'the door. To new ideas, new ways to connect. A future we can’t yet predict. But in this world of endless streams. ',
    },
    {
      text: 'We sometimes forget our human dreams. We seek for likes, for instant fame. We lose ourselves in the game So',
    },
    {
      text: 'let us use technology well.And not become its endless spell. For in the end, it’s how we choose To make the most of this endless muse.',
    },
  ]
  const fullText = convertTextLinesToText(textLines)

  render(<NotificationContentText testID={containerTestId}>{fullText}</NotificationContentText>)

  const el = screen.queryByTestId(containerTestId) as ReactTestInstance
  fireEvent(el, 'onTextLayout', { nativeEvent: { lines: textLines } })

  const textView = screen.queryByTestId(notificationContentTextTestId)
  const [text] = textView?.children ?? ''
  expect(text).toMatchInlineSnapshot(
    '"Infinite Scroll. Swipe, swipe, scroll down. Endless feeds without a frown .Likes and hearts and retweets to. Endless scrolling, what to do? A world of data, at our fingertips. Information flows, never skips. The internet,a boundless space. A virtual world we can embrace. From screens to apps, to cloud and more. Technology opens …"'
  )
})

it('renders correctly with long text', () => {
  render(
    <View>
      <NotificationContentText>
        I enjoy working on community projects during my spare time. This text cannot exceed three lines or else. This
        text cannot exceed three lines or else. This text cannot exceed.
      </NotificationContentText>
    </View>
  )

  expect(screen).toMatchSnapshot()
})

it('renders correctly with short text', () => {
  render(
    <View>
      <NotificationContentText>I enjoy working on community projects.</NotificationContentText>
    </View>
  )

  expect(screen).toMatchSnapshot()
})
