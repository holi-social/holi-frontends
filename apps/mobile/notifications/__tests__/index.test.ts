import type { NotificationResponse } from 'expo-notifications'
import type { NotificationTrigger } from 'expo-notifications/build/Notifications.types'

import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { screenUrlFromNotificationResponse } from '@holi/mobile/notifications'

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

/* There are two types of notification messages received via APNs / FCM
 * - type "notification"
 * - type "background notification" (iOS) (called "data-only" on Android)
 *
 * Until HOLI-10219, holi used background / data-only notifications exclusively. They'll be referred to as "legacy" in
 * the tests below. Since HOLI-10219, holi uses notification messages. The tests in here ensure that the frontend is
 * compatible with both the "legacy" and the "new" way of doing things, until we are safe that "legacy" can be removed.
 *
 * When receiving notifications within our app, expo-notifications tries to abstract the differences of the platforms
 * into the `content` field. Unfortunately, it does not succeed in case of the field `content.data` (it is empty, we
 * have to fetch it from `trigger.payload` instead), so we can not fully rely on the abstraction.
 *
 * When a notification is displayed to the user, either via the OS or via scheduled notifications out of the app, a
 * `NotificationResponse` object is received at a `NotificationResponseReceivedListener` and translated into a URL to
 * be opened (which this test class is about).
 */

// Android notifications don't support JSON objects as values in the `data` key (as iOS does), but only strings
// see https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidConfig

// received when BE sends data-only notification (legacy, before HOLI-10219)
const createAndroidLegacyNotificationResponse = (data: { [key: string]: string }): NotificationResponse => ({
  notification: {
    request: {
      trigger: {
        type: 'push',
        remoteMessage: {
          data: data,
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
        categoryIdentifier: null,
        title: null,
        subtitle: null,
        body: null,
        data: data,
        sound: null,
      },
    },
    date: 0,
  },
  actionIdentifier: 'something',
})

const createAndroidPushNotificationResponse = (data: { [key: string]: string }) =>
  createAndroidNotificationResponse(data, 'push')

const createAndroidScheduledNotificationResponse = (data: { [key: string]: string }) =>
  createAndroidNotificationResponse(data, null)

// received when BE sends notification (after BE changes for HOLI-10219)

// triggerType 'push' - received when a push notification is received and is then interacted with
// triggerType null   - received when a scheduled notification is received and is then interacted with
const createAndroidNotificationResponse = (
  data: { [key: string]: string },
  triggerType: 'push' | null
): NotificationResponse => ({
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1729675238595,
    request: {
      identifier: '0:1729675238607473%90033c7f90033c7f',
      trigger: {
        type: triggerType, // at runtime, it can actually contain null (scheduled notifications), not allowed according to expo-notification types
      } as unknown as NotificationTrigger,
      content: {
        categoryIdentifier: null,
        data: data, // typically, JSON as serialized string
        title: 'notification title',
        subtitle: 'notification subtitle', // actually undefined at runtime
        body: 'notification body', // actually undefined at runtime
        sound: null, // actually undefined at runtime
      },
    },
  },
})

// see https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification
// iOS supports full JSON in the `data` key (unlike Android). it can be found in notification.request.trigger.payload

// received when BE sends "background notification" (legacy, before HOLI-10219)
const createLegacyIOSNotificationResponse = (data: { [key: string]: unknown }): NotificationResponse => ({
  notification: {
    request: {
      trigger: {
        type: 'push',
        payload: data,
      },
      identifier: '',
      content: {
        categoryIdentifier: null,
        title: null,
        subtitle: null,
        body: null,
        data: data,
        sound: null,
      },
    },
    date: 0,
  },
  actionIdentifier: 'something',
})

// received when a scheduled notification was received and is then interacted with
const createIOSScheduledNotificationResponse = (data: { [key: string]: unknown }): NotificationResponse => ({
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1729676185.636791,
    request: {
      content: {
        summaryArgumentCount: 0,
        targetContentIdentifier: undefined, // actually null at runtime, but not allowed by expo-notification types
        threadIdentifier: '',
        interruptionLevel: 'active',
        attachments: [],
        categoryIdentifier: '',
        summaryArgument: '',
        data: data,
        title: 'New message',
        subtitle: null,
        badge: null,
        launchImageName: '',
        sound: null,
        body: '11:36',
      },
      identifier: '585709aa-9c14-47a6-b6bd-3093a39d6adf',
      trigger: {
        type: 'unknown',
      },
    },
  },
})

// received when a push notification was received while the app was in background or not running and is then interacted with
const createIOSPushNotificationResponse = (data: { [key: string]: unknown }): NotificationResponse => ({
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1729676317.0206208,
    request: {
      content: {
        summaryArgumentCount: 0,
        targetContentIdentifier: undefined, // actually null at runtime, but not allowed by expo-notification types
        threadIdentifier: '',
        interruptionLevel: 'active',
        attachments: [],
        categoryIdentifier: '',
        summaryArgument: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: null as unknown as Record<string, any>, // actually null at runtime, but not allowed by expo-notification types, should IMO be parsed into this field from trigger.payload but is not done by expo-notifications
        title: 'holi Chat',
        subtitle: null,
        badge: 1,
        launchImageName: '',
        sound: null,
        body: 'You have a new message or invitation.',
      },
      identifier: 'AF235EB7-7049-4D7B-AA3D-97C53D11409F',
      trigger: {
        payload: data,
        type: 'push',
        // class: 'UNPushNotificationTrigger', // actually present at runtime, but not existing in expo-notification types
      },
    },
  },
})

type AndroidNotificationResponseFactory = (data: { [key: string]: string }) => NotificationResponse
type IOSNotificationResponseFactory = (data: { [key: string]: unknown }) => NotificationResponse

const androidTestVariants = [
  ['android', 'legacy', createAndroidLegacyNotificationResponse],
  ['android', 'push', createAndroidPushNotificationResponse],
  ['android', 'scheduled', createAndroidScheduledNotificationResponse],
] as [string, string, AndroidNotificationResponseFactory][]

const iosTestVariants = [
  ['ios', 'legacy', createLegacyIOSNotificationResponse],
  ['ios', 'push', createIOSPushNotificationResponse],
  ['ios', 'scheduled', createIOSScheduledNotificationResponse],
] as [string, string, IOSNotificationResponseFactory][]

describe('screenUrlFromNotificationResponse', () => {
  it.each(androidTestVariants)(
    '[%s, %s] should not create url for non-push notifications',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(createNotificationResponse({}))
      expect(url).toBeFalsy()
    }
  )
  it.each(iosTestVariants)(
    '[%s, %s] should not create url for non-push notifications',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(createNotificationResponse({}))
      expect(url).toBeFalsy()
    }
  )

  // -------------------------------------------------------------------------------------------------------------------

  it.each(androidTestVariants)(
    '[%s, %s] should create correct url chat notification',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(createNotificationResponse({ room_id: '123' }))
      expect(url).toEqual('holi://chat/rooms/123')
    }
  )
  it.each(iosTestVariants)(
    '[%s, %s] should create correct url chat notification',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(createNotificationResponse({ room_id: '123' }))
      expect(url).toEqual('holi://chat/rooms/123')
    }
  )

  // -------------------------------------------------------------------------------------------------------------------

  it.each(androidTestVariants)(
    '[%s, %s] should not create url chat notification if room id is missing',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(createNotificationResponse({}))
      expect(url).toBeFalsy()
    }
  )
  it.each(iosTestVariants)(
    '[%s, %s] should not create url chat notification if room id is missing',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(createNotificationResponse({}))
      expect(url).toBeFalsy()
    }
  )

  // -------------------------------------------------------------------------------------------------------------------

  const novuNotificationTypeTests = [
    [
      NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
      'holi://spaces/space1/collaborators/manage?tab=pending&userId=123&refresh=true',
    ],
    [NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER, 'holi://spaces/space1?refresh=true'],
    [NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN, 'holi://spaces/space1?refresh=true'],
    [NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER, 'holi://spaces/space1'],
    [NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN, 'holi://spaces/space1'],
    [NovuNotificationType.SPACE_MEMBERSHIP_INVITE, 'holi://spaces/space1'],
    [NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER, 'holi://spaces/space1?refresh=true'],
    [NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN, 'holi://spaces/space1?refresh=true'],
    [NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER, 'holi://spaces/space1'],
    [NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN, 'holi://spaces/space1'],
  ]

  describe.each(androidTestVariants)(
    '[%s, %s] for Novu notifications',
    (platform, variant, createNotificationResponse) => {
      it.each(novuNotificationTypeTests)(
        'should create correct url for notification type %s',
        (notificationType, expectedUrl) => {
          const url = screenUrlFromNotificationResponse(
            createNotificationResponse({
              notificationType,
              data: JSON.stringify({
                space: { name: 'space1' },
                user: { id: '123' },
              }),
            })
          )
          expect(url).toEqual(expectedUrl)
        }
      )
    }
  )
  describe.each(iosTestVariants)('[%s, %s] for Novu notifications', (platform, variant, createNotificationResponse) => {
    it.each(novuNotificationTypeTests)(
      'should create correct url for notification type %s',
      (notificationType, expectedUrl) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType,
            data: JSON.stringify({
              space: { name: 'space1' },
              user: { id: '123' },
            }),
          })
        )
        expect(url).toEqual(expectedUrl)
      }
    )
  })

  // -------------------------------------------------------------------------------------------------------------------

  it.each(androidTestVariants)(
    '[%s, %s] should create correct url for space membership request notification if user id is missing',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
          notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
          data: JSON.stringify({
            space: { name: 'space1' },
          }),
        })
      )
      expect(url).toEqual('holi://spaces/space1/collaborators/manage?tab=pending&refresh=true')
    }
  )
  it.each(iosTestVariants)(
    '[%s, %s] should create correct url for space membership request notification if user id is missing',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
          notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
          data: {
            space: { name: 'space1' },
          },
        })
      )
      expect(url).toEqual('holi://spaces/space1/collaborators/manage?tab=pending&refresh=true')
    }
  )

  // -------------------------------------------------------------------------------------------------------------------

  it.each(androidTestVariants)(
    '[%s, %s] should not create url for space membership request notification if space name is missing',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
          notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
        })
      )
      expect(url).toBeFalsy()
      expect(mockConsoleWarn).toHaveBeenCalled()
    }
  )
  it.each(iosTestVariants)(
    '[%s, %s] should not create url for space membership request notification if space name is missing',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
          notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
        })
      )
      expect(url).toBeFalsy()
      expect(mockConsoleWarn).toHaveBeenCalled()
    }
  )

  // -------------------------------------------------------------------------------------------------------------------

  it.each(androidTestVariants)(
    '[%s, %s] should create correct url for post comment mention notification',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
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
    }
  )
  it.each(iosTestVariants)(
    '[%s, %s] should create correct url for post comment mention notification',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
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
    }
  )

  // -------------------------------------------------------------------------------------------------------------------

  it.each(androidTestVariants)(
    '[%s, %s] should create correct url for post comment author notification',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
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
    }
  )

  it.each(iosTestVariants)(
    '[%s, %s] should create correct url for post comment author notification',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
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
    }
  )

  // -------------------------------------------------------------------------------------------------------------------

  it.each(androidTestVariants)(
    '[%s, %s] should create correct url for space new post notification',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
          notificationType: NovuNotificationType.SPACE_NEW_POST,
          data: JSON.stringify({
            user: { id: 'user_id' },
            post: { id: 'post_id', title: 'post title', isPublic: true },
            space: { name: 'space1' },
          }),
        })
      )
      expect(url).toEqual('holi://spaces/space1?tab=updates')
    }
  )
  it.each(iosTestVariants)(
    '[%s, %s] should create correct url for space new post notification',
    (platform, variant, createNotificationResponse) => {
      const url = screenUrlFromNotificationResponse(
        createNotificationResponse({
          notificationType: NovuNotificationType.SPACE_NEW_POST,
          data: JSON.stringify({
            user: { id: 'user_id' },
            post: { id: 'post_id', title: 'post title', isPublic: true },
            space: { name: 'space1' },
          }),
        })
      )
      expect(url).toEqual('holi://spaces/space1?tab=updates')
    }
  )

  // -------------------------------------------------------------------------------------------------------------------

  describe('Appointment notifications', () => {
    it.each(androidTestVariants)(
      '[%s, %s] should create a url to a newly created appointment',
      (platform, variant, createNotificationResponse) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType: NovuNotificationType.SPACE_APPOINTMENT_CREATION,
            data: JSON.stringify({
              appointment: { id: 122 },
              space: { name: 'space1' },
            }),
          })
        )
        expect(url).toEqual('holi://spaces/space1/appointments/122')
      }
    )
    it.each(iosTestVariants)(
      '[%s, %s] should create a url to a newly created appointment',
      (platform, variant, createNotificationResponse) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType: NovuNotificationType.SPACE_APPOINTMENT_CREATION,
            data: JSON.stringify({
              appointment: { id: 122 },
              space: { name: 'space1' },
            }),
          })
        )
        expect(url).toEqual('holi://spaces/space1/appointments/122')
      }
    )

    // -----------------------------------------------------------------------------------------------------------------

    it.each(androidTestVariants)(
      '[%s, %s] should create a url to an updated appointment',
      (platform, variant, createNotificationResponse) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType: NovuNotificationType.SPACE_APPOINTMENT_UPDATE,
            data: JSON.stringify({
              appointment: { id: 123 },
              space: { name: 'space1' },
            }),
          })
        )
        expect(url).toEqual('holi://spaces/space1/appointments/123?refresh=true')
      }
    )
    it.each(iosTestVariants)(
      '[%s, %s] should create a url to an updated appointment',
      (platform, variant, createNotificationResponse) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType: NovuNotificationType.SPACE_APPOINTMENT_UPDATE,
            data: JSON.stringify({
              appointment: { id: 123 },
              space: { name: 'space1' },
            }),
          })
        )
        expect(url).toEqual('holi://spaces/space1/appointments/123?refresh=true')
      }
    )

    // -----------------------------------------------------------------------------------------------------------------

    it.each(androidTestVariants)(
      "[%s, %s] should create a url to it's Space for a deleted appointment",
      (platform, variant, createNotificationResponse) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType: NovuNotificationType.SPACE_APPOINTMENT_DELETION,
            data: JSON.stringify({
              space: { name: 'space1' },
            }),
          })
        )
        expect(url).toEqual('holi://spaces/space1?tab=involvement')
      }
    )
    it.each(iosTestVariants)(
      "[%s, %s] should create a url to it's Space for a deleted appointment",
      (platform, variant, createNotificationResponse) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType: NovuNotificationType.SPACE_APPOINTMENT_DELETION,
            data: JSON.stringify({
              space: { name: 'space1' },
            }),
          })
        )
        expect(url).toEqual('holi://spaces/space1?tab=involvement')
      }
    )
  })

  describe.each(androidTestVariants)(
    '[%s, %s] for challenges notifications',
    (platform, variant, createNotificationResponse) => {
      it.each`
        type                                                  | data                                         | expectedUrl
        ${NovuNotificationType.CHALLENGE_APPROVAL}            | ${{ link: '/video/someUuid?refererPath=/' }} | ${'holi://apps/challenges?path=%2Fvideo%2FsomeUuid%3FrefererPath%3D%2F'}
        ${NovuNotificationType.CHALLENGE_KEEP_STREAK}         | ${{ link: '/keepStreak' }}                   | ${'holi://apps/challenges?path=%2FkeepStreak'}
        ${NovuNotificationType.CHALLENGE_NEW_COMMENT}         | ${{ link: '/comment' }}                      | ${'holi://apps/challenges?path=%2Fcomment'}
        ${NovuNotificationType.CHALLENGE_LEVEL_UP_HOLI_QUEST} | ${{ link: '/quest?overlay=false' }}          | ${'holi://apps/challenges?path=%2Fquest%3Foverlay%3Dfalse'}
      `('should route to the correct URL for $notificationType notifications', ({ type, data, expectedUrl }) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType: type,
            data: JSON.stringify(data),
          })
        )
        expect(url).toEqual(expectedUrl)
      })
    }
  )
  describe.each(iosTestVariants)(
    '[%s, %s] for challenges notifications',
    (platform, variant, createNotificationResponse) => {
      it.each`
        type                                                  | data                                         | expectedUrl
        ${NovuNotificationType.CHALLENGE_APPROVAL}            | ${{ link: '/video/someUuid?refererPath=/' }} | ${'holi://apps/challenges?path=%2Fvideo%2FsomeUuid%3FrefererPath%3D%2F'}
        ${NovuNotificationType.CHALLENGE_KEEP_STREAK}         | ${{ link: '/keepStreak' }}                   | ${'holi://apps/challenges?path=%2FkeepStreak'}
        ${NovuNotificationType.CHALLENGE_NEW_COMMENT}         | ${{ link: '/comment' }}                      | ${'holi://apps/challenges?path=%2Fcomment'}
        ${NovuNotificationType.CHALLENGE_LEVEL_UP_HOLI_QUEST} | ${{ link: '/quest?overlay=false' }}          | ${'holi://apps/challenges?path=%2Fquest%3Foverlay%3Dfalse'}
      `('should route to the correct URL for $type notifications', ({ type, data, expectedUrl }) => {
        const url = screenUrlFromNotificationResponse(
          createNotificationResponse({
            notificationType: type,
            data: JSON.stringify(data),
          })
        )
        expect(url).toEqual(expectedUrl)
      })
    }
  )
})
