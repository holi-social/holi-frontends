import type React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { VolunteeringProgressCard } from '@holi-apps/volunteering/components/VolunteeringProgressCard'
import {
  badgesMockWithUnseen,
  badgesMockWithoutUnseen,
  volunteeringDetailsScreenDataMock as document,
} from './helpers/mocks'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import type { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { EarnedBadgesModalProvider } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModalProvider'

const renderWithApolloAndProvider = (component: React.ReactElement, mocks: MockedResponse[] = []) =>
  render(
    <MockedProvider mocks={[...mocks]} addTypename={false}>
      <EarnedBadgesModalProvider>{component}</EarnedBadgesModalProvider>
    </MockedProvider>
  )

jest.useFakeTimers()
jest.mock('@holi/ui/components/atoms/HoliLottie', () => jest.fn())
jest.mock('@holi/api/graphql/graphql-codegen', () => ({
  ...jest.requireActual('@holi/api/graphql/graphql-codegen'),
  useGetRewardsCounterQuery: jest.fn(),
}))
const { useGetRewardsCounterQuery } = require('@holi/api/graphql/graphql-codegen')

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))

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

describe('VolunteeringProgressCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useGetRewardsCounterQuery.mockReturnValue([jest.fn(), { data: { rewards_counter: { counter: 0 } } }])
    mockUseFeatureFlag.mockReturnValue([false, undefined])
  })

  describe('Status TO_DO', () => {
    it('renders correctly', () => {
      renderWithApolloAndProvider(
        <VolunteeringProgressCard onStatusChange={jest.fn()} document={document} engagementId="123" />
      )

      expect(screen.getByText('volunteer.progress.progressCard.connect.title')).toBeOnTheScreen()
      expect(screen.getByText('volunteer.progress.progressCard.connect.text')).toBeOnTheScreen()
      expect(screen.getByText('volunteering.progress.button.reachedOut')).toBeOnTheScreen()
    })

    it('changes status to CONTACTED when "reachedOut" button is pressed and modal is dismissed', async () => {
      const user = userEvent.setup()
      const onStatusChange = jest.fn()
      renderWithApolloAndProvider(
        <VolunteeringProgressCard onStatusChange={onStatusChange} document={document} engagementId="123" />
      )

      await user.press(screen.getByText('volunteering.progress.button.reachedOut'))

      expect(screen.getByText('volunteer.progress.contactConfirmed.modal.title')).toBeOnTheScreen()
      expect(screen.getByText('volunteer.progress.contactConfirmed.modal.text')).toBeOnTheScreen()
      expect(screen.getByText('volunteering.progress.button.contactSuccess')).toBeOnTheScreen()

      await user.press(screen.getByText('volunteering.progress.button.contactSuccess'))

      expect(onStatusChange).toHaveBeenCalledWith(VolunteeringOpportunityStatusValue.Contacted)
    })
  })

  describe('Status CONTACTED without badges', () => {
    it('renders correctly', () => {
      renderWithApolloAndProvider(
        <VolunteeringProgressCard
          status={VolunteeringOpportunityStatusValue.Contacted}
          onStatusChange={jest.fn()}
          document={document}
          engagementId="123"
        />
      )

      expect(screen.getByText('volunteer.progress.progressCard.act.title')).toBeOnTheScreen()
      expect(screen.getByText('volunteer.progress.progressCard.act.text')).toBeOnTheScreen()
      expect(screen.getByText('volunteering.progress.button.act')).toBeOnTheScreen()
    })

    it('changes status to DOING when "act" button is pressed and modal is dismissed', async () => {
      const user = userEvent.setup()
      const onStatusChange = jest.fn()
      const refetchMock: MockedResponse = {
        request: { query: badgesMockWithUnseen.request.query },
        result: badgesMockWithUnseen.result,
      }
      renderWithApolloAndProvider(
        <VolunteeringProgressCard
          status={VolunteeringOpportunityStatusValue.Contacted}
          onStatusChange={onStatusChange}
          document={document}
          engagementId="123"
        />,
        [badgesMockWithoutUnseen, refetchMock]
      )

      await user.press(screen.getByText('volunteering.progress.button.act'))

      screen.debug()
      expect(screen.getByText('goodDeed.rewardsMessage.button')).toBeOnTheScreen()
      await user.press(screen.getByText('goodDeed.rewardsMessage.button'))
      expect(onStatusChange).toHaveBeenCalledWith(VolunteeringOpportunityStatusValue.Doing)
    })
  })

  describe('Status DOING', () => {
    it('renders correctly', () => {
      renderWithApolloAndProvider(
        <VolunteeringProgressCard
          status={VolunteeringOpportunityStatusValue.Doing}
          onStatusChange={jest.fn()}
          document={document}
          engagementId="123"
        />
      )

      expect(screen.getByText('volunteer.progress.progressCard.helping.title')).toBeOnTheScreen()
      expect(screen.getByText('volunteer.progress.progressCard.helping.text')).toBeOnTheScreen()
      expect(screen.getByText('volunteering.progress.button.nextAction')).toBeOnTheScreen()
    })
  })
})
