import { HeadlessService } from '@novu/headless'
import { IMessage } from '@novu/shared'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type Notification2ContextType = {
  notifications: IMessage[]
  markNotificationsAsRead: (messageIds: string[]) => void
  markAllMessagesAsRead: (feedId: string) => void
  pageNum: number
  setPageNum: (num: number) => void
  fetchNotifications: () => void
  active: boolean
  setActive: (status: boolean) => void
}

const Notification2Context = createContext<null | Notification2ContextType>(null)

const Notification2Provider: React.FC<
  React.PropsWithChildren<{ novuSubscriberId: string; novuApplicationId: string }>
> = ({ children, novuSubscriberId, novuApplicationId }) => {
  const [notifications, setNotifications] = useState<IMessage[]>([])
  const [active, setActive] = useState(false)

  const headlessServiceRef = useRef<HeadlessService>(null)
  const [pageNum, setPageNum] = useState(0)

  const fetchNotifications = useCallback(() => {
    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.fetchNotifications({
        listener: (result) => {
          console.log('fetchNotifications listener', JSON.stringify(result, null, 2))
          // Handle the state of the fetching process and errors here.
        },
        onSuccess: (response) => {
          console.log('fetchNotifications onSuccess', JSON.stringify(response, null, 2))
          // Handle the fetched notifications here.
          setNotifications(response.data) // Store notifications in the state
        },
        onError: (error) => {
          console.log('fetchNotifications error:', error)
        },
        page: pageNum, // page number to be fetched
      })
    }
  }, [pageNum])

  useEffect(() => {
    const headlessService = new HeadlessService({
      //todo gregor: replace with env var
      //todo gregor: obtain subscriber id from authenticated users id
      applicationIdentifier: novuApplicationId,
      subscriberId: novuSubscriberId,
    })

    headlessService.initializeSession({
      listener: (result) => {
        console.log('initializeSession listener', JSON.stringify(result, null, 2))
      },
      onSuccess: (session) => {
        console.log('initializeSession onSuccess', JSON.stringify(session, null, 2))
        headlessServiceRef.current = headlessService
        fetchNotifications()
      },
      onError: (error) => {
        console.log('initializeSession error:', error)
      },
    })
  }, [fetchNotifications])

  // Function to mark notifications as read
  const markNotificationsAsRead = (messageIds: string[]) => {
    if (!Array.isArray(messageIds)) {
      messageIds = [messageIds]
    }

    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.markNotificationsAsRead({
        messageId: messageIds,
        onSuccess: (session) => {
          console.log('markNotificationsAsRead onSuccess', JSON.stringify(session, null, 2))
        },
        listener: (result) => {
          console.log('markNotificationsAsRead listener', JSON.stringify(result, null, 2))
        },
        onError: (error) => {
          console.error('markNotificationsAsRead error:', error)
        },
      })
    }
  }

  const markAllMessagesAsRead = (feedId: string) => {
    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.markAllMessagesAsRead({
        listener: (result) => {
          console.log('markNotificationsAsRead listener', JSON.stringify(result, null, 2))
          // Handle the result of marking all messages as read
          // You can update the state or perform other actions here
        },
        onError: (error) => {
          console.error('Error marking all messages as read:', error)
          // Implement error handling if needed
        },
        feedId: feedId, // Pass the feed ID here, it can be an array or a single ID
      })
    }
  }

  return (
    <Notification2Context.Provider
      value={{
        notifications,
        markNotificationsAsRead,
        markAllMessagesAsRead,
        pageNum,
        setPageNum,
        fetchNotifications,
        active,
        setActive,
      }}
    >
      {children}
    </Notification2Context.Provider>
  )
}

const useNotificationContext = () => useContext(Notification2Context)

export { useNotificationContext, Notification2Provider }
