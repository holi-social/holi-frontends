import { NotificationConnection, NotificationType } from '@holi/core/screens/notifications/components/types'

export const notificationConnectionRequest: NotificationConnection = {
  id: '0809f4a0-04c8-43ae-a291-4f7bfce1ba7d',
  notificationType: NotificationType.CONNECTION_REQUEST,
  owner: {
    id: '0009ab1e-4b30-42da-8429-79b5f4061cb9',
    avatar: '',
    avatarLabel: 'DR',
    avatarDefaultColor: '#F8F860',
    fullName: 'DimaY Ros',
  },
  created: '2022-12-21T11:11:38.978527+00:00',
  read: false,
  options: {
    user: {
      id: '77d695d7-fea0-4b20-a2a4-d641e63fb25b',
      avatar: '',
      avatarLabel: 'SU',
      avatarDefaultColor: '#7BD7EA',
      fullName: 'Some User',
    },
  },
}
