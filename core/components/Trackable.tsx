import { Button, ButtonProps } from 'holi-bricks/components/button/Button'
import { TextLink, TextLinkProps } from 'holi-bricks/components/text'
import React from 'react'
import { GestureResponderEvent } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading, { HoliButtonLoadingProps } from '@holi/ui/components/molecules/HoliButtonLoading'

export interface TrackableBaseProps {
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
}

export type TrackableProps<P extends TrackableBaseProps> = P & {
  trackingEvent: TrackingEvent
}

const Trackable = <P extends TrackableBaseProps>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: TrackableProps<P>) => {
    const { track } = useTracking()

    return (
      <Component
        {...props}
        onPress={(e) => {
          track(props.trackingEvent)
          // Return result to allow handling of loading state and event propagation
          return props.onPress?.(e)
        }}
      />
    )
  }
  return WrappedComponent
}

export const HoliButtonTracked = Trackable<React.PropsWithChildren<HoliButtonProps>>(HoliButton)
export const HoliButtonLoadingTracked = Trackable<React.PropsWithChildren<HoliButtonLoadingProps>>(HoliButtonLoading)
export const HoliLinkTracked = Trackable<React.PropsWithChildren<HoliLinkProps>>(HoliLink)
export const HoliTextLinkTracked = Trackable<React.PropsWithChildren<HoliTextLinkProps>>(HoliTextLink)
export const TextLinkTracked = Trackable<React.PropsWithChildren<TextLinkProps>>(TextLink)
export const ButtonTracked = Trackable<ButtonProps>(Button)
