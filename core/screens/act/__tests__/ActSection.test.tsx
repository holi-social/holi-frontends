import { mockFeatureFlags } from '@holi/core/helpers/__mocks__/mockFeatureFlags'

import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import type { User } from '@holi/core/domain/shared/types'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { ActSection } from '@holi/core/screens/act/ActSection'

import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { ActSectionType } from '@holi/core/screens/act/sections'
import { usePaginatedDonations } from '@holi-apps/donations/hooks/usePaginatedDonations'
import { createLocalizedDonations } from '@holi-apps/donations/components/__tests__/testData'

export const user: User = {
  id: '123',
  identity: 'member1.feynman',
  avatar: '',
  fullName: 'fullName',
  firstName: 'firstName',
  lastName: 'lastName',
  aboutMe: '',
  avatarDefaultColor: 'papayawhip',
  avatarLabel: 'FL',
  interestsV2: [],
  skillsV2: [],
}

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => ({
    isLoggedIn: true,
    user,
  }),
}))

const mockUseVolunteeringRecos = jest.mocked(useVolunteeringRecos)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecos', () => ({
  useVolunteeringRecos: jest.fn(),
}))
const mockUsePaginatedDonations = jest.mocked(usePaginatedDonations)
jest.mock('@holi-apps/donations/hooks/usePaginatedDonations', () => ({
  usePaginatedDonations: jest.fn(),
}))

jest.mock('cross-fetch', () => () => {
  const response = {
    challenges: [
      {
        id: 'e4bfb7fc-4171-499f-8d77-d19bd34a8557',
        title: 'Give animals & insects a home',
        participants: 8,
        challengeDetailPath: '/quest?challengeId=e4bfb7fc-4171-499f-8d77-d19bd34a8557&overlay=true',
        submissions: [
          {
            id: '60b88bda-262d-4a63-a4a9-2ca4e2d691d0',
            submissionDate: '2024-09-03T21:32:26.425172Z',
            imageUrl:
              'https://ik.imagekit.io/holi/challenges-transcoder-staging-1ce0/138f481e-5e4f-4a2f-89f0-b619ae4827c6.jpg?tr=ar-9-16,w-200',
            videoUrl: 'https://challenges-transcoder-staging-1ce0.holi.social/138f481e-5e4f-4a2f-89f0-b619ae4827c6',
            playerPath: '/video/play/LATEST_REVIEW/60b88bda-262d-4a63-a4a9-2ca4e2d691d0?referrerPath=/',
            submitter: {
              id: 'c52cbb66-cfb7-460e-9d02-21e9c24ded42',
              username: 'release 1320 release testing account',
              avatarUrl:
                'https://ik.imagekit.io/holi/_DEV_/avatar/a5558cd1-0ccd-469d-8318-e0b1c37c42f9_HhQ7euc5n1.jpeg?tr=w-128,ar-1-1,fo-face,z-0.7',
            },
          },
          {
            id: '70bde9ad-a775-4a15-b804-68345e6d70d1',
            submissionDate: '2024-08-27T15:53:31.257353Z',
            imageUrl:
              'https://ik.imagekit.io/holi/challenges-transcoder-staging-1ce0/716c0f79-f8ee-4da7-ac4e-e054c91806dc.jpg?tr=ar-9-16,w-200',
            videoUrl: 'https://challenges-transcoder-staging-1ce0.holi.social/716c0f79-f8ee-4da7-ac4e-e054c91806dc',
            playerPath: '/video/play/LATEST_REVIEW/70bde9ad-a775-4a15-b804-68345e6d70d1?referrerPath=/',
            submitter: {
              id: '08a5922a-c5ed-44dd-b8bb-f5e618dd6d31',
              username: 'The Mailinator Account Not to be confused with the Terminator account',
              avatarUrl:
                'https://ik.imagekit.io/holi/_DEV_/avatar/c54dc1b4-3227-4d46-adf7-3c31fff41d4c_UIt0asn0G.jpeg?tr=w-128,ar-1-1,fo-face,z-0.7',
            },
          },
        ],
        lastSubmittedDate: '2024-09-03T21:32:26.425172Z',
      },
      {
        id: '7368146d-fa56-4fc1-98ec-649ccc8197a2',
        title: 'Go for a walk',
        participants: 7,
        challengeDetailPath: '/quest?challengeId=7368146d-fa56-4fc1-98ec-649ccc8197a2&overlay=true',
        submissions: [
          {
            id: '36b0226f-324e-4a52-8faf-593ae8f6e184',
            submissionDate: '2024-08-28T17:15:44.719670Z',
            imageUrl:
              'https://ik.imagekit.io/holi/challenges-transcoder-staging-1ce0/a822f39d-d71e-4f0b-a362-591dd32150b9.jpg?tr=ar-9-16,w-200',
            videoUrl: 'https://challenges-transcoder-staging-1ce0.holi.social/a822f39d-d71e-4f0b-a362-591dd32150b9',
            playerPath: '/video/play/LATEST_REVIEW/36b0226f-324e-4a52-8faf-593ae8f6e184?referrerPath=/',
            submitter: {
              id: 'e4fe2c0b-66a2-401e-8dc8-55af99afd1a6',
              username: 'mailinator 11 ',
              avatarUrl:
                'https://ik.imagekit.io/holi/_DEV_/avatar/5d91a785-5bad-45f1-98be-a29473a4d362_E_MBZCQeh.jpg?tr=w-128,ar-1-1,fo-face,z-0.7',
            },
          },
          {
            id: 'cd691266-3a45-43f2-a833-56935db2cab4',
            submissionDate: '2024-08-20T13:01:25.022455Z',
            imageUrl:
              'https://ik.imagekit.io/holi/challenges-transcoder-staging-1ce0/5724faf3-4204-4bed-80ad-1f128e44d19f.jpg?tr=ar-9-16,w-200',
            videoUrl: 'https://challenges-transcoder-staging-1ce0.holi.social/5724faf3-4204-4bed-80ad-1f128e44d19f',
            playerPath: '/video/play/LATEST_REVIEW/cd691266-3a45-43f2-a833-56935db2cab4?referrerPath=/',
            submitter: {
              id: 'a5585917-8f4b-476a-981b-9c49ea8b91f3',
              username: 'Hans la',
              avatarUrl:
                'https://ik.imagekit.io/holi/_DEV_/avatar/4f4ff9a7-6880-46ce-b3a0-34c7b33061ef__klXP1H8h.png?tr=w-128,ar-1-1,fo-face,z-0.7',
            },
          },
        ],
        lastSubmittedDate: '2024-08-28T17:15:44.719670Z',
      },
      {
        id: '6abf5c40-1152-4aaa-a37b-a513a257b594',
        title: 'Your oldest technical device',
        participants: 7,
        challengeDetailPath: '/quest?challengeId=6abf5c40-1152-4aaa-a37b-a513a257b594&overlay=true',
        submissions: [
          {
            id: '0bb48f6c-a075-4d15-8625-bcb7f5966544',
            submissionDate: '2024-08-20T15:40:21.103901Z',
            imageUrl:
              'https://ik.imagekit.io/holi/challenges-transcoder-staging-1ce0/11b7ffbe-ce5b-4938-8f88-518e00a3b6cc.jpg?tr=ar-9-16,w-200',
            videoUrl: 'https://challenges-transcoder-staging-1ce0.holi.social/11b7ffbe-ce5b-4938-8f88-518e00a3b6cc',
            playerPath: '/video/play/LATEST_REVIEW/0bb48f6c-a075-4d15-8625-bcb7f5966544?referrerPath=/',
            submitter: {
              id: '08a5922a-c5ed-44dd-b8bb-f5e618dd6d31',
              username: 'The Mailinator Account Not to be confused with the Terminator account',
              avatarUrl:
                'https://ik.imagekit.io/holi/_DEV_/avatar/c54dc1b4-3227-4d46-adf7-3c31fff41d4c_UIt0asn0G.jpeg?tr=w-128,ar-1-1,fo-face,z-0.7',
            },
          },
          {
            id: 'daf2488c-5078-47b3-82ea-0f9e8a6a7831',
            submissionDate: '2024-08-14T15:43:32.748868Z',
            imageUrl:
              'https://ik.imagekit.io/holi/challenges-transcoder-staging-1ce0/e6f712f8-b3cf-45e5-9027-4b1739256a51.jpg?tr=ar-9-16,w-200',
            videoUrl: 'https://challenges-transcoder-staging-1ce0.holi.social/e6f712f8-b3cf-45e5-9027-4b1739256a51',
            playerPath: '/video/play/LATEST_REVIEW/daf2488c-5078-47b3-82ea-0f9e8a6a7831?referrerPath=/',
            submitter: {
              id: '1f73d92d-b6c8-4ca5-ac08-37222e7c5dd2',
              username: 'account number 6 of the series ',
              avatarUrl:
                'https://ik.imagekit.io/holi/_DEV_/avatar/5e92eddc-0b91-40b8-8e65-8fb42b2dcb90_iLHw5vbC3.jpeg?tr=w-128,ar-1-1,fo-face,z-0.7',
            },
          },
        ],
        lastSubmittedDate: '2024-08-20T15:40:21.103901Z',
      },
      {
        id: '6bd552ed-0d1f-4ba6-bfb8-bff9817ab048',
        title: 'Coffe to go with your cup',
        participants: 6,
        challengeDetailPath: '/quest?challengeId=6bd552ed-0d1f-4ba6-bfb8-bff9817ab048&overlay=true',
        submissions: [
          {
            id: '8cf15971-d9cc-4eae-b9be-4cf3ec123ca9',
            submissionDate: '2024-08-07T14:35:43.215863Z',
            imageUrl:
              'https://ik.imagekit.io/holi/challenges-transcoder-staging-1ce0/266240b1-081c-4b55-bd5d-ccb6d9a9b0bd.jpg?tr=ar-9-16,w-200',
            videoUrl: 'https://challenges-transcoder-staging-1ce0.holi.social/266240b1-081c-4b55-bd5d-ccb6d9a9b0bd',
            playerPath: '/video/play/LATEST_REVIEW/8cf15971-d9cc-4eae-b9be-4cf3ec123ca9?referrerPath=/',
            submitter: {
              id: '5290c2aa-f0f0-4d2a-bf07-6566ed62da88',
              username: 'namm ',
              avatarUrl:
                'https://ik.imagekit.io/holi/_DEV_/avatar/a22a06f4-dee6-4ac1-ac05-cafe1f2b4989_YN8SD7ulw.jpeg?tr=w-128,ar-1-1,fo-face,z-0.7',
            },
          },
          {
            id: 'b5e02deb-3a89-4d23-8c1d-0c0ed9ac5b24',
            submissionDate: '2024-07-04T06:46:20.894814Z',
            imageUrl:
              'https://ik.imagekit.io/holi/challenges-transcoder-staging-1ce0/72bdd774-863a-4704-a669-965174eb86be.jpg?tr=ar-9-16,w-200',
            videoUrl: 'https://challenges-transcoder-staging-1ce0.holi.social/72bdd774-863a-4704-a669-965174eb86be',
            playerPath: '/video/play/LATEST_REVIEW/b5e02deb-3a89-4d23-8c1d-0c0ed9ac5b24?referrerPath=/',
            submitter: {
              id: 'e8d0d392-c8a0-413e-9d7b-63edf25082b3',
              username: 'Tom ',
              avatarUrl: null,
            },
          },
        ],
        lastSubmittedDate: '2024-08-07T14:35:43.215863Z',
      },
    ],
  }
  return Promise.resolve(new Response(JSON.stringify(response)))
})

const mockPosthog = jest.fn()
jest.mock('@holi/core/tracking/PosthogCrossPlatform', () => ({
  usePosthogCrossPlatform: () => mockPosthog(),
}))

describe('ActHome Section', () => {
  beforeEach(() => {
    mockFeatureFlags({
      [FeatureFlagKey.DONATIONS]: 'on',
      [FeatureFlagKey.VOLUNTEERING]: 'on',
    })
    mockUseVolunteeringRecos.mockReturnValue({
      isLoading: false,
      engagements: makeVolunteeringDocuments(5),
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })
    mockUsePaginatedDonations.mockReturnValue({
      isLoading: false,
      projects: createLocalizedDonations(5),
      canFetchMore: false,
      fetchNextPage: jest.fn(),
      totalResults: 123,
      isFetchingMore: false,
    })
  })

  it('shows DONATIONS', async () => {
    render(<ActSection type={ActSectionType.DONATIONS} />)
    expect(await screen.findByTestId('donations-reco-slider-heading-button'))
    const donationsRecos = await screen.findAllByTestId('donations-list-item')
    expect(donationsRecos.length).toBe(5)
  })

  it('shows VOLUNTEERING', async () => {
    render(<ActSection type={ActSectionType.VOLUNTEERING} />)
    expect(await screen.findByTestId('volunteering-reco-slider-heading-button'))
    const volunteeringRecos = await screen.findAllByTestId('volunteering-reco-card')
    expect(volunteeringRecos.length).toBe(5)
  })

  it('shows CHALLENGES', async () => {
    mockPosthog.mockReturnValue({
      distinctId: () => '1234',
    })
    render(
      <MockedProvider mocks={[]}>
        <ActSection type={ActSectionType.CHALLENGES} />
      </MockedProvider>
    )
    expect(await screen.findByTestId('challenges-reco-slider-heading-button'))
    expect(await screen.findAllByTestId('challenges-reco-slider-load-more-button'))
  })
})
