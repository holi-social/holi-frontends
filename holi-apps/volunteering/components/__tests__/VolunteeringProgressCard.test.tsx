import React from 'react'
import { renderRouter, screen, userEvent } from 'expo-router/testing-library'
import { VolunteeringProgressCard } from '@holi-apps/volunteering/components/VolunteeringProgressCard'
import { volunteeringDetailsScreenData as document } from './helpers/seedData'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'

jest.useFakeTimers()
jest.mock('@holi/ui/components/atoms/HoliLottie', () => jest.fn())
jest.mock('@holi/api/graphql/graphql-codegen', () => ({
  ...jest.requireActual('@holi/api/graphql/graphql-codegen'),
  useGetRewardsCounterQuery: jest.fn(),
}))
const { useGetRewardsCounterQuery } = require('@holi/api/graphql/graphql-codegen')

describe('VolunteeringProgressCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useGetRewardsCounterQuery.mockReturnValue({ data: { rewards_counter: { counter: 0 } } })
  })

  describe('Status TO_DO', () => {
    it('renders correctly', () => {
      renderRouter({
        index: () => <VolunteeringProgressCard onStatusChange={jest.fn()} document={document} engagementId="123" />,
      })

      expect(screen.getByText('volunteer.progress.progressCard.connect.title')).toBeOnTheScreen()
      expect(screen.getByText('volunteer.progress.progressCard.connect.text')).toBeOnTheScreen()
      expect(screen.getByText('volunteering.progress.button.reachedOut')).toBeOnTheScreen()
    })

    it('changes status to CONTACTED when "reachedOut" button is pressed and modal is dismissed', async () => {
      const user = userEvent.setup()
      const onStatusChange = jest.fn()
      renderRouter({
        index: () => (
          <VolunteeringProgressCard onStatusChange={onStatusChange} document={document} engagementId="123" />
        ),
      })

      await user.press(screen.getByText('volunteering.progress.button.reachedOut'))

      expect(screen.getByText('volunteer.progress.contactConfirmed.modal.title')).toBeOnTheScreen()
      expect(screen.getByText('volunteer.progress.contactConfirmed.modal.text')).toBeOnTheScreen()
      expect(screen.getByText('volunteering.progress.button.contactSuccess')).toBeOnTheScreen()

      await user.press(screen.getByText('volunteering.progress.button.contactSuccess'))

      expect(onStatusChange).toHaveBeenCalledWith(VolunteeringOpportunityStatusValue.Contacted)
    })
  })

  describe('Status CONTACTED', () => {
    it('renders correctly', () => {
      renderRouter({
        index: () => (
          <VolunteeringProgressCard
            status={VolunteeringOpportunityStatusValue.Contacted}
            onStatusChange={jest.fn()}
            document={document}
            engagementId="123"
          />
        ),
      })

      expect(screen.getByText('volunteer.progress.progressCard.act.title')).toBeOnTheScreen()
      expect(screen.getByText('volunteer.progress.progressCard.act.text')).toBeOnTheScreen()
      expect(screen.getByText('volunteering.progress.button.act')).toBeOnTheScreen()
    })

    it('changes status to DOING when "act" button is pressed and modal is dismissed', async () => {
      const user = userEvent.setup()
      const onStatusChange = jest.fn()
      renderRouter({
        index: () => (
          <VolunteeringProgressCard
            status={VolunteeringOpportunityStatusValue.Contacted}
            onStatusChange={onStatusChange}
            document={document}
            engagementId="123"
          />
        ),
      })

      await user.press(screen.getByText('volunteering.progress.button.act'))

      screen.debug()
      expect(screen.getByText('goodDeed.rewardsMessage.button')).toBeOnTheScreen()
      await user.press(screen.getByText('goodDeed.rewardsMessage.button'))

      expect(onStatusChange).toHaveBeenCalledWith(VolunteeringOpportunityStatusValue.Doing)
    })
  })

  describe('Status DOING', () => {
    it('renders correctly', () => {
      renderRouter({
        index: () => (
          <VolunteeringProgressCard
            status={VolunteeringOpportunityStatusValue.Doing}
            onStatusChange={jest.fn()}
            document={document}
            engagementId="123"
          />
        ),
      })

      expect(screen.getByText('volunteer.progress.progressCard.helping.title')).toBeOnTheScreen()
      expect(screen.getByText('volunteer.progress.progressCard.helping.text')).toBeOnTheScreen()
      expect(screen.getByText('volunteering.progress.button.nextAction')).toBeOnTheScreen()
    })
  })
})
