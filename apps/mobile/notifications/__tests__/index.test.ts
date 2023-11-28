import { NotificationResponse } from 'expo-notifications'

import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { transformPushInteractionToUrl } from '@holi/mobile/notifications'

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

describe('transformPushInteractionToUrl', () => {
  const createAndroidNotificationResponse = (
    payload: { [key: string]: string },
    type: 'push' | 'unknown' = 'push'
  ): Partial<NotificationResponse> => ({
    notification: {
      request: {
        trigger: {
          type,
          remoteMessage: {
            data: payload,
            collapseKey: null,
            from: null,
            messageId: null,
            messageType: null,
            originalPriority: 0,
            priority: 0,
            sentTime: 0,
            to: null,
            ttl: 0,
            notification: null,
          },
        },
        identifier: '',
        content: {
          title: null,
          subtitle: null,
          body: null,
          data: payload,
          sound: null,
        },
      },
      date: 0,
    },
  })

  const createIOSNotificationResponse = (
    payload: { [key: string]: unknown },
    type: 'push' | 'unknown' = 'push'
  ): Partial<NotificationResponse> => ({
    notification: {
      request: {
        trigger: {
          type,
          payload,
        },
        identifier: '',
        content: {
          title: null,
          subtitle: null,
          body: null,
          data: payload,
          sound: null,
        },
      },
      date: 0,
    },
  })

  it('should not create url for non-push notifications', () => {
    const url = transformPushInteractionToUrl(createAndroidNotificationResponse({}, 'unknown'))
    expect(url).toBeFalsy()
  })

  it('should create correct url for Android chat notification', () => {
    const url = transformPushInteractionToUrl(createAndroidNotificationResponse({ room_id: '123' }))
    expect(url).toEqual('holi://chat/rooms/123')
  })

  it('should create correct url for iOS chat notification', () => {
    const url = transformPushInteractionToUrl(createIOSNotificationResponse({ room_id: '123' }))
    expect(url).toEqual('holi://chat/rooms/123')
  })

  it('should not create url for Android chat notification if room id is missing', () => {
    const url = transformPushInteractionToUrl(createAndroidNotificationResponse({}))
    expect(url).toBeFalsy()
  })

  it('should not create url for iOS chat notification if room id is missing', () => {
    const url = transformPushInteractionToUrl(createIOSNotificationResponse({}))
    expect(url).toBeFalsy()
  })

  const tests = [
    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
      expectedUrl: 'holi://spaces/space1/collaborators/manage?tab=pending&userId=123&refresh=true',
    },
    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER,
      expectedUrl: 'holi://spaces/space1?refresh=true',
    },

    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN,
      expectedUrl: 'holi://spaces/space1?refresh=true',
    },

    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER,
      expectedUrl: 'holi://spaces/space1',
    },

    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN,
      expectedUrl: 'holi://spaces/space1',
    },

    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_INVITE,
      expectedUrl: 'holi://spaces/space1',
    },

    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER,
      expectedUrl: 'holi://spaces/space1?refresh=true',
    },

    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN,
      expectedUrl: 'holi://spaces/space1?refresh=true',
    },

    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER,
      expectedUrl: 'holi://spaces/space1',
    },

    {
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN,
      expectedUrl: 'holi://spaces/space1',
    },
  ]

  it.each(tests)('should create correct url for $notificationType on Android', ({ notificationType, expectedUrl }) => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType,
        data: JSON.stringify({
          space: { name: 'space1' },
          user: { id: '123' },
        }),
      })
    )
    expect(url).toEqual(expectedUrl)
  })

  it.each(tests)('should create correct url for $notificationType on iOS', ({ notificationType, expectedUrl }) => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType,
        data: {
          space: { name: 'space1' },
          user: { id: '123' },
        },
      })
    )
    expect(url).toEqual(expectedUrl)
  })

  it('should create correct url for space membership request notification if user id is missing on Android', () => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
        data: JSON.stringify({
          space: { name: 'space1' },
        }),
      })
    )
    expect(url).toEqual('holi://spaces/space1/collaborators/manage?tab=pending&refresh=true')
  })

  it('should create correct url for space membership request notification if user id is missing on iOS', () => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
        data: {
          space: { name: 'space1' },
        },
      })
    )
    expect(url).toEqual('holi://spaces/space1/collaborators/manage?tab=pending&refresh=true')
  })

  it('should not create url for space membership request notification if space name is missing on Android', () => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
      })
    )
    expect(url).toBeFalsy()
    expect(mockConsoleWarn).toHaveBeenCalled()
  })

  it('should not create url for space membership request notification if space name is missing on iOS', () => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
      })
    )
    expect(url).toBeFalsy()
    expect(mockConsoleWarn).toHaveBeenCalled()
  })

  it('should create correct url for post comment mention notification on Android', () => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.POST_COMMENT_MENTION,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          comment: { id: 'comment_id', text: 'comment text' },
        }),
      })
    )
    expect(url).toEqual('holi://posts/post_id?commentId=comment_id')
  })

  it('should create correct url for post comment mention notification on iOS', () => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.POST_COMMENT_MENTION,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          comment: { id: 'comment_id', text: 'comment text' },
        }),
      })
    )
    expect(url).toEqual('holi://posts/post_id?commentId=comment_id')
  })

  it('should create correct url for post comment author notification on Android', () => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.POST_COMMENT_AUTHOR,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          comment: { id: 'comment_id', text: 'comment text' },
        }),
      })
    )
    expect(url).toEqual('holi://posts/post_id?commentId=comment_id')
  })

  it('should create correct url for post comment author notification on iOS', () => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.POST_COMMENT_AUTHOR,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          comment: { id: 'comment_id', text: 'comment text' },
        }),
      })
    )
    expect(url).toEqual('holi://posts/post_id?commentId=comment_id')
  })

  it('should create correct url for space new post notification on Android', () => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.SPACE_NEW_POST,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          space: { name: 'space1' },
        }),
      })
    )
    expect(url).toEqual('holi://posts/post_id')
  })

  it('should create correct url for space new post notification on iOS', () => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.SPACE_NEW_POST,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          space: { name: 'space1' },
        }),
      })
    )
    expect(url).toEqual('holi://posts/post_id')
  })
})
