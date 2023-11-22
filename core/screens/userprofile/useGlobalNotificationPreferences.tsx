import { ApiService, IUserGlobalPreferenceSettings } from '@novu/client'
import { useCallback, useEffect, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'

export const useGlobalNotificationPreferences = () => {
  const { novuService } = useNotificationService()

  const [globalPreferences, setGlobalPreferences] = useState<{
    push: boolean
    email: boolean
  } | null>(null)

  const [globalPreferencesUpdating, setGlobalPreferencesUpdating] = useState(true)

  const setPreferences = (response: IUserGlobalPreferenceSettings) => {
    const preference = response.preference
    if (preference) {
      setGlobalPreferences({
        push: !!preference.channels.push,
        email: !!preference.channels.email,
      })
    }
    setGlobalPreferencesUpdating(false)
  }

  useEffect(() => {
    if (novuService) {
      novuService
        .getUserGlobalPreference()
        .then((response) => {
          setPreferences(response[0])
        })
        .catch((error: Error) => {
          logError(error, 'Error while fetching users notification preferences', {
            location: 'useGlobalNotificationPreferences',
          })
        })
    }
  }, [novuService])

  const updateChannelPreferences = useCallback(
    async (novuPerChannelPreferences: Parameters<typeof ApiService.prototype.updateSubscriberGlobalPreference>[0]) => {
      if (novuService) {
        setGlobalPreferencesUpdating(true)
        try {
          // novu preferences have a boolean parameter
          // to represent an even more global setting
          // which we keep on
          const novuOverallGloballyEnabled = true

          const response = await novuService.updateSubscriberGlobalPreference(
            novuPerChannelPreferences,
            novuOverallGloballyEnabled
          )
          setPreferences(response)
        } catch (e) {
          logError(e, 'Error while updating users notification preferences', {
            location: 'useGlobalNotificationPreferences.updateChannelPreferences',
          })
        } finally {
          setGlobalPreferencesUpdating(false)
        }
      }
    },
    [novuService]
  )

  const togglePushPreference = async (value: boolean) => {
    if (value != globalPreferences?.push) {
      await updateChannelPreferences([
        { channelType: 'email', enabled: !!globalPreferences?.email },
        { channelType: 'push', enabled: value },
      ])
    }
  }

  const toggleEmailPreference = async (value: boolean) => {
    if (value != globalPreferences?.email) {
      await updateChannelPreferences([
        { channelType: 'email', enabled: value },
        { channelType: 'push', enabled: !!globalPreferences?.push },
      ])
    }
  }

  return {
    globalPreferences,
    toggleEmailPreference,
    togglePushPreference,
    globalPreferencesUpdating,
  }
}
