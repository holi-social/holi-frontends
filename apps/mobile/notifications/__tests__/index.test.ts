import { NotificationResponse } from 'expo-notifications'

import { NotificationType, transformPushInteractionToUrl } from '@holi/mobile/notifications'

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

  it('should create correct url for space membership request notification on Android', () => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notification_type: NotificationType.SPACE_MEMBERSHIP_REQUEST,
        data: JSON.stringify({
          space: { name: 'space1' },
          user: { id: '123' },
        }),
      })
    )
    expect(url).toEqual('holi://spaces/space1/collaborators/manage?tab=pending&userId=123')
  })

  it('should create correct url for space membership request notification on iOS', () => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notification_type: NotificationType.SPACE_MEMBERSHIP_REQUEST,
        data: {
          space: { name: 'space1' },
          user: { id: '123' },
        },
      })
    )
    expect(url).toEqual('holi://spaces/space1/collaborators/manage?tab=pending&userId=123')
  })

  it('should create correct url for space membership request notification if user id is missing on Android', () => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notification_type: NotificationType.SPACE_MEMBERSHIP_REQUEST,
        data: JSON.stringify({
          space: { name: 'space1' },
        }),
      })
    )
    expect(url).toEqual('holi://spaces/space1/collaborators/manage?tab=pending')
  })

  it('should create correct url for space membership request notification if user id is missing on iOS', () => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notification_type: NotificationType.SPACE_MEMBERSHIP_REQUEST,
        data: {
          space: { name: 'space1' },
        },
      })
    )
    expect(url).toEqual('holi://spaces/space1/collaborators/manage?tab=pending')
  })

  it('should not create url for space membership request notification if space name is missing on Android', () => {
    const url = transformPushInteractionToUrl(
      createAndroidNotificationResponse({
        notification_type: NotificationType.SPACE_MEMBERSHIP_REQUEST,
      })
    )
    expect(url).toBeFalsy()
  })

  it('should not create url for space membership request notification if space name is missing on iOS', () => {
    const url = transformPushInteractionToUrl(
      createIOSNotificationResponse({
        notification_type: NotificationType.SPACE_MEMBERSHIP_REQUEST,
      })
    )
    expect(url).toBeFalsy()
  })
})
