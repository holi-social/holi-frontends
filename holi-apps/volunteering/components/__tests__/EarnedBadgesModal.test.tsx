import type React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { badgesMockWithUnseen, refetchMock } from './helpers/mocks'
import type { MockLink } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing/react'
import { EarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModal'
import { BadgeState } from '@holi/core/screens/userprofile/hooks/useBadges'

const renderWithApollo = (component: React.ReactElement, mocks: MockLink.MockedResponse[] = []) =>
  render(<MockedProvider mocks={[...mocks]}>{component}</MockedProvider>)

jest.mock('@holi/core/components/Screen', () => {
  return {
    Screen: ({
      children,
      StickyBottomComponent,
    }: { children: React.ReactNode; StickyBottomComponent?: React.ReactNode }) => (
      <>
        {children}
        {StickyBottomComponent && <>{StickyBottomComponent}</>}
      </>
    ),
  }
})

describe('EarnedBadgesModal', () => {
  it('renders correctly', async () => {
    const user = userEvent.setup()
    const onDismiss = jest.fn()

    renderWithApollo(
      <EarnedBadgesModal
        visible
        badge={{
          id: 'badge-id-1',
          currentStep: undefined,
          totalSteps: undefined,
          unlockedAt: new Date('2024-01-01T00:00:00.000Z'),
          seenAt: undefined,
          state: BadgeState.achieved,
          imgSrc: require('@holi/ui/assets/img/badges/badge-impact-starter-small.svg'),
          imgSrcDetailed: require('@holi/ui/assets/img/badges/badge-impact-starter.svg'),
          animationName: 'badgeImpactStarter',
          localazyKey: 'volunteering.levelOne',
          buttonLink: '/act',
        }}
        onDismiss={onDismiss}
        shown={true}
        label="badges.modal"
      />,
      [badgesMockWithUnseen, refetchMock]
    )
    const scratchButton = await screen.findByText('badge.modal.scratchCard.button') // "Reveal"
    expect(scratchButton).toBeOnTheScreen()

    await user.press(scratchButton)

    const rewardButton = await screen.findByText('badge.modal.reward.button') // "Claim Superpower"
    expect(rewardButton).toBeOnTheScreen()
    await user.press(rewardButton)

    expect(onDismiss).toHaveBeenCalled()
  })
})
