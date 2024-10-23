import { mockPlatformOS, setupPlatformOSMock } from '@holi/core/helpers/__mocks__/mockPlatformOS'

import { NotificationResponse } from 'expo-notifications'

import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { transformPushInteractionToUrl } from '@holi/mobile/notifications'

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

describe('transformPushInteractionToUrl', () => {
  setupPlatformOSMock()
  const createAndroidNotificationResponse = (
    payload: { [key: string]: string },
    type: 'push' | 'unknown' = 'push'
  ): NotificationResponse => ({
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
    actionIdentifier: 'something',
  })

  const createIOSNotificationResponse = (
    payload: { [key: string]: unknown },
    type: 'push' | 'unknown' = 'push'
  ): NotificationResponse => ({
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
    actionIdentifier: 'something',
  })

  it('should not create url for non-push notifications', () => {
    const url = transformPushInteractionToUrl(createAndroidNotificationResponse({}, 'unknown'))
    expect(url).toBeFalsy()
  })

  it('should create correct url for Android chat notification', () => {
    mockPlatformOS('android')
    const url = transformPushInteractionToUrl(createAndroidNotificationResponse({ room_id: '123' }))
    expect(url).toEqual('holi://chat/rooms/123')
  })

  it('should create correct url for iOS chat notification', () => {
    mockPlatformOS('ios')
    const url = transformPushInteractionToUrl(createIOSNotificationResponse({ room_id: '123' }))
    expect(url).toEqual('holi://chat/rooms/123')
  })

  it('should not create url for Android chat notification if room id is missing', () => {
    mockPlatformOS('android')
    const url = transformPushInteractionToUrl(createAndroidNotificationResponse({}))
    expect(url).toBeFalsy()
  })

  it('should not create url for iOS chat notification if room id is missing', () => {
    mockPlatformOS('ios')
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
    mockPlatformOS('android')
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
    mockPlatformOS('ios')
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
    mockPlatformOS('android')
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
    mockPlatformOS('ios')
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
    mockPlatformOS('android')
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
      })
    )
    expect(url).toBeFalsy()
    expect(mockConsoleWarn).toHaveBeenCalled()
  })

  it('should not create url for space membership request notification if space name is missing on iOS', () => {
    mockPlatformOS('ios')
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
      })
    )
    expect(url).toBeFalsy()
    expect(mockConsoleWarn).toHaveBeenCalled()
  })

  it('should create correct url for post comment mention notification on Android', () => {
    mockPlatformOS('android')
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.POST_COMMENT_MENTION,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          comment: { id: 'comment_id', text: 'comment text' },
          commentLink: '/spacePostCommentMentionLink',
        }),
      })
    )
    expect(url).toEqual('holi://spacePostCommentMentionLink')
  })

  it('should create correct url for post comment mention notification on iOS', () => {
    mockPlatformOS('ios')
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.POST_COMMENT_MENTION,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          comment: { id: 'comment_id', text: 'comment text' },
          commentLink: '/spacePostCommentLink',
        }),
      })
    )
    expect(url).toEqual('holi://spacePostCommentLink')
  })

  it('should create correct url for post comment author notification on Android', () => {
    mockPlatformOS('android')
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.POST_COMMENT_AUTHOR,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          comment: { id: 'comment_id', text: 'comment text' },
          commentLink: '/spacePostCommentLink',
        }),
      })
    )
    expect(url).toEqual('holi://spacePostCommentLink')
  })

  it('should create correct url for post comment author notification on iOS', () => {
    mockPlatformOS('ios')
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.POST_COMMENT_AUTHOR,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title' },
          comment: { id: 'comment_id', text: 'comment text' },
          commentLink: '/spacePostCommentLink',
        }),
      })
    )
    expect(url).toEqual('holi://spacePostCommentLink')
  })

  it('should create correct url for space new post notification on Android', () => {
    mockPlatformOS('android')
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notificationType: NovuNotificationType.SPACE_NEW_POST,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title', isPublic: true },
          space: { name: 'space1' },
        }),
      })
    )
    expect(url).toEqual('holi://spaces/space1?tab=updates')
  })

  it('should create correct url for space new post notification on iOS', () => {
    mockPlatformOS('ios')
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notificationType: NovuNotificationType.SPACE_NEW_POST,
        data: JSON.stringify({
          user: { id: 'user_id' },
          post: { id: 'post_id', title: 'post title', isPublic: true },
          space: { name: 'space1' },
        }),
      })
    )
    expect(url).toEqual('holi://spaces/space1?tab=updates')
  })

  describe('Appointment notifications', () => {
    it('should create a url to a newly created appointment', () => {
      mockPlatformOS('ios')
      const url = transformPushInteractionToUrl(
        createIOSNotificationResponse({
          notificationType: NovuNotificationType.SPACE_APPOINTMENT_CREATION,
          data: JSON.stringify({
            appointment: { id: 122 },
            space: { name: 'space1' },
          }),
        })
      )
      expect(url).toEqual('holi://spaces/space1/appointments/122')
    })

    it('should create a url to an updated appointment', () => {
      mockPlatformOS('ios')
      const url = transformPushInteractionToUrl(
        createIOSNotificationResponse({
          notificationType: NovuNotificationType.SPACE_APPOINTMENT_UPDATE,
          data: JSON.stringify({
            appointment: { id: 123 },
            space: { name: 'space1' },
          }),
        })
      )
      expect(url).toEqual('holi://spaces/space1/appointments/123?refresh=true')
    })

    it("should create a url to it's Space for a deleted appointment", () => {
      mockPlatformOS('ios')
      const url = transformPushInteractionToUrl(
        createIOSNotificationResponse({
          notificationType: NovuNotificationType.SPACE_APPOINTMENT_DELETION,
          data: JSON.stringify({
            space: { name: 'space1' },
          }),
        })
      )
      expect(url).toEqual('holi://spaces/space1?tab=involvement')
    })
  })

  describe('Challenge notifications', () => {
    it.each`
      type                                                  | data                                         | expectedUrl
      ${NovuNotificationType.CHALLENGE_APPROVAL}            | ${{ link: '/video/someUuid?refererPath=/' }} | ${'holi://apps/challenges?path=%2Fvideo%2FsomeUuid%3FrefererPath%3D%2F'}
      ${NovuNotificationType.CHALLENGE_KEEP_STREAK}         | ${{ link: '/keepStreak' }}                   | ${'holi://apps/challenges?path=%2FkeepStreak'}
      ${NovuNotificationType.CHALLENGE_NEW_COMMENT}         | ${{ link: '/comment' }}                      | ${'holi://apps/challenges?path=%2Fcomment'}
      ${NovuNotificationType.CHALLENGE_LEVEL_UP_HOLI_QUEST} | ${{ link: '/quest?overlay=false' }}          | ${'holi://apps/challenges?path=%2Fquest%3Foverlay%3Dfalse'}
    `('should route to the correct URL for $notificationType notifications', ({ type, data, expectedUrl }) => {
      mockPlatformOS('ios')
      const url = transformPushInteractionToUrl(
        createIOSNotificationResponse({
          notificationType: type,
          data: JSON.stringify(data),
        })
      )
      expect(url).toEqual(expectedUrl)
    })
  })
})
