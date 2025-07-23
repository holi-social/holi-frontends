import React from 'react'

import { VolunteeringContact } from '@holi-apps/volunteering/components/VolunteeringContact'
import { Typesense_DocumentContactType } from '@holi/api/graphql/graphql-codegen'
import { render, userEvent, screen, act } from '@testing-library/react-native'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import Clipboard from '@react-native-clipboard/clipboard'

jest.mock('@holi/core/components/HoliWebView')

describe('VolunteeringContact', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('with contact info', () => {
    const document: VolunteeringDetailsScreenData = {
      title: 'Some title',
      externalUrl: 'https://www.lovelace.com',
      contact: [
        { type: Typesense_DocumentContactType.Person, value: 'Ada Lovelace' },
        { type: Typesense_DocumentContactType.Email, value: 'ada@lovelace.com' },
        { type: Typesense_DocumentContactType.Phone, value: '+49 1234 1234567' },
        {
          label: "Ada's Website",
          type: Typesense_DocumentContactType.Website,
          value: 'https://www.lovelace.com',
        },
      ],
    }

    it('should open contact drawer and list all information', async () => {
      const user = userEvent.setup()

      render(<VolunteeringContact document={document} engagementId="123" />)

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
      }

      render(<VolunteeringContact document={documentWithOtherWebsite} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      expect(screen.getByTestId('volunteering-contact-modal')).toBeOnTheScreen()
      expect(screen.getByText('https://www.lovelace.com'))
    })

    it('should copy name of contact person', async () => {
      const user = userEvent.setup()
      render(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.person.cta'))

      expect(Clipboard.setString).toHaveBeenCalledWith('Ada Lovelace')
    })

    it('should call phone number', async () => {
      const user = userEvent.setup()
      render(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.phone.cta'))

      expect(mockOpenURL).toHaveBeenCalledWith('tel:+49 1234 1234567')
    })

    it('should send email', async () => {
      const user = userEvent.setup()
      render(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.email.cta'))

      expect(mockOpenURL).toHaveBeenCalledWith('mailto:ada@lovelace.com')
    })

    it('should open website in drawer', async () => {
      const user = userEvent.setup()
      render(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
      await act(jest.runAllTimersAsync)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.contactsDrawer.website.cta'))
      await act(jest.runAllTimersAsync)

      expect(screen.getByTestId('volunteering-external-url-modal')).toBeOnTheScreen()
    })
  })

  describe('without contact info', () => {
    const document: VolunteeringDetailsScreenData = {
      title: 'Some title',
      externalUrl: 'https://www.lovelace.com',
      contact: [],
    }
    it('should open drawer for web view', async () => {
      const user = userEvent.setup()
      render(<VolunteeringContact document={document} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouch'))
      await act(jest.runAllTimersAsync)

      expect(screen.getByTestId('volunteering-external-url-modal')).toBeOnTheScreen()
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
      }

      const user = userEvent.setup()
      render(<VolunteeringContact document={documentWithSameWebsiteContact} engagementId="123" />)

      await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouch'))
      await act(jest.runAllTimersAsync)

      expect(screen.getByTestId('volunteering-external-url-modal')).toBeOnTheScreen()
    })

    // it('tracks external link clicks (mobile)', async () => {
    //   const document = engagementTypesenseDocument(engagementId)
    //   const data = transformTypesenseDocument(t, 'en', document)
    //   mockUseVolunteeringDetailsData.mockReturnValue({
    //     isLoading: false,
    //     document: data,
    //   })

    //   renderComponent()

    //   await act(jest.runAllTimersAsync)

    //   const user = userEvent.setup()
    //   await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouch'))

    //   await act(jest.runAllTimersAsync)
    //   expect(screen.getByTestId('volunteering-external-url-modal')).toBeOnTheScreen()
    // })
  })
})
