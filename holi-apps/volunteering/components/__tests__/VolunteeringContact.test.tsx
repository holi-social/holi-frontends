jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
}))

import type React from 'react'

import { VolunteeringContact } from '@holi-apps/volunteering/components/VolunteeringContact'
import { Typesense_DocumentContactType } from '@holi/api/graphql/graphql-codegen'
import { render, userEvent, screen, act } from '@testing-library/react-native'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import Clipboard from '@react-native-clipboard/clipboard'
import { TrackingEvent } from '@holi/core/tracking'
import { MockedProvider } from '@apollo/client/testing'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { useLoginState } from '@holi/core/auth/loginState'

import { volunteeringDetailsScreenData as document } from './helpers/seedData'

const mockUseLoginState = jest.mocked(useLoginState)

const mockOpenURL = global.mockOpenURL
const mockTrack = global.mockTrack

const mockUseOpenLink = jest.fn()
jest.mock('@holi/ui/helper/useOpenLink', () => ({
  useOpenLink: () => mockUseOpenLink,
}))

jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => [false, {}],
}))

const authenticatedUserMock = {
  request: {
    query: authenticatedUserV2Query,
    variables: { userId: 'test-user-id' },
  },
  result: {
    data: {
      authenticatedUserV2: {
        id: 'test-user-id',
        identity: 'test-user',
        accountType: 'UNKNOWN',
        avatar: 'https://example.com/avatar.jpg',
        avatarBlurhash: '',
        avatarDefaultColor: '#7571EC',
        avatarLabel: 'TU',
        fullName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        aboutMe: '',
        pronouns: '',
        location: '',
        role: 'REGULAR',
        geolocationId: '',
        engagementLevel: '',
        interestsV2: [],
        skillsV2: [],
        connectionStatusToMyself: null,
        trackingConsentAnalytics: false,
        trackingConsentPersonalization: false,
        trackingConsentAdPartners: false,
        isEmployee: false,
        email: 'test@example.com',
        isOidc: false,
        __typename: 'AuthenticatedUser',
      },
    },
  },
}

const renderWithApollo = (component: React.ReactElement) => {
  return render(
    <MockedProvider mocks={[authenticatedUserMock]} addTypename={false}>
      {component}
    </MockedProvider>
  )
}

describe('VolunteeringContact', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    mockUseLoginState.mockReturnValue({
      isUnknown: false,
      isLoggedOut: false,
      isLoggedIn: true,
      userId: 'test-user-id',
    })
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('with contact info', () => {
    it('should open contact drawer and list all information', async () => {
      const user = userEvent.setup()

      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      expect(screen.getByTestId('volunteering-contact-modal')).toBeOnTheScreen()
      expect(screen.getByText('Ada Lovelace'))
      expect(screen.getByText('ada@lovelace.com'))
      expect(screen.getByText('+49 1234 1234567'))
      expect(screen.getByText('https://www.lovelace.com'))
    })

    it('should open contact drawer and if there is a new website link', async () => {
      const user = userEvent.setup()
      const documentWithOtherWebsite: VolunteeringDetailsScreenData = {
        title: 'Some title',
        externalUrl: 'some other url',
        contact: [
          {
            label: "Ada's Website",
            type: Typesense_DocumentContactType.Website,
            value: 'https://www.lovelace.com',
          },
        ],
        status: null,
      }

      renderWithApollo(<VolunteeringContact document={documentWithOtherWebsite} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      expect(screen.getByTestId('volunteering-contact-modal')).toBeOnTheScreen()
      expect(screen.getByText('https://www.lovelace.com'))
    })

    it('should copy name of contact person', async () => {
      const user = userEvent.setup()
      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.person.cta'))

      expect(Clipboard.setString).toHaveBeenCalledWith('Ada Lovelace')
    })

    it('should call phone number', async () => {
      const user = userEvent.setup()
      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.phone.cta'))

      expect(mockOpenURL).toHaveBeenCalledWith('tel:+49 1234 1234567')
    })

    it('should send email', async () => {
      const user = userEvent.setup()
      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.email.cta'))

      expect(mockOpenURL).toHaveBeenCalledWith('mailto:ada@lovelace.com')
    })

    it('should open website in drawer', async () => {
      const user = userEvent.setup()
      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.website.cta'))
      await act(jest.runAllTimersAsync)

      expect(mockUseOpenLink).toHaveBeenCalledWith('https://www.lovelace.com')
    })

    it('tracks opening the drawer', async () => {
      const user = userEvent.setup()

      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Volunteering.pressed('123', {
          commitmentType: 'once',
          contact_info_displayed: ['person', 'email', 'phone', 'website'],
        })
      )
    })

    const contactDataTypes = ['person', 'email', 'phone', 'website']
    it.each(contactDataTypes)('should track contact via %s', async (contactType) => {
      const user = userEvent.setup()

      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)
      await user.press(screen.getByLabelText(`volunteering.engagementDetail.contactsDrawer.${contactType}.cta`))

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Volunteering.contacted('123', {
          commitmentType: 'once',
          contact_info_displayed: ['person', 'email', 'phone', 'website'],
          contact_method_selected: contactType,
        })
      )
    })
  })

  describe('without contact info', () => {
    const document: VolunteeringDetailsScreenData = {
      title: 'Some title',
      externalUrl: 'https://www.lovelace.com',
      commitmentType: 'recurring',
      contact: [],
      status: null,
    }
    it('should open drawer for web view', async () => {
      const user = userEvent.setup()
      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.website.cta'))

      expect(mockUseOpenLink).toHaveBeenCalledWith(document.externalUrl)
    })

    it('should open drawer for web view if there is no other contact info', async () => {
      const documentWithSameWebsiteContact: VolunteeringDetailsScreenData = {
        title: 'Some title',
        externalUrl: 'https://www.lovelace.com',
        contact: [
          {
            label: "Ada's Website",
            type: Typesense_DocumentContactType.Website,
            value: 'https://www.lovelace.com',
          },
        ],
        status: null,
      }
      const user = userEvent.setup()

      renderWithApollo(<VolunteeringContact document={documentWithSameWebsiteContact} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.website.cta'))

      expect(mockUseOpenLink).toHaveBeenCalledWith(document.externalUrl)
    })

    it('tracks opening the webview', async () => {
      const user = userEvent.setup()

      renderWithApollo(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.website.cta'))

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Volunteering.pressed('123', {
          commitmentType: 'recurring',
          contact_info_displayed: [],
        })
      )
    })
  })
})
