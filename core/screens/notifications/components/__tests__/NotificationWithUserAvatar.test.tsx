import { act, render, screen } from '@testing-library/react-native'
import React from 'react'

import NotificationWithUserAvatar from '@holi/core/screens/notifications/components/NotificationWithUserAvatar'
import { notificationConnectionRequest } from '@holi/core/screens/notifications/components/seedData'
import HoliText from '@holi/ui/components/atoms/HoliText'

describe('NotificationWithUserAvatar.tsx', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('matches snapshot', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-04'))

    render(
      <NotificationWithUserAvatar
        notification={notificationConnectionRequest}
        i18nKey="notifications.post.mention.message"
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('renders user avatar component', () => {
    const { getByText } = render(<NotificationWithUserAvatar notification={notificationConnectionRequest} />)

    expect(getByText(notificationConnectionRequest.options.user.avatarLabel)).toBeDefined()
  })

  it('renders "content" prop component if passed', () => {
    const text =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit obcaecati facere ducimus dolorem maiores.'
    const { getByText } = render(
      <NotificationWithUserAvatar notification={notificationConnectionRequest} content={<HoliText>{text}</HoliText>} />
    )

    expect(getByText(text)).toBeDefined()
  })

  it('renders children if passed', () => {
    const text =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit obcaecati facere ducimus dolorem maiores.'
    const { getByText } = render(
      <NotificationWithUserAvatar notification={notificationConnectionRequest}>
        <HoliText>{text}</HoliText>
      </NotificationWithUserAvatar>
    )

    expect(getByText(text)).toBeDefined()
  })
})
