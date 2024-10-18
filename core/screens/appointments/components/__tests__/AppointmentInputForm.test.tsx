import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

import AppointmentInputForm, {
  getAppointmentDefaultInitialState,
} from '@holi/core/screens/appointments/components/AppointmentInputForm'
import { space } from '@holi/core/screens/spaces/__tests__/testData'

jest.mock('@holi/ui/components/organisms/HoliImagePicker')
jest.mock('@holi/core/geolocation/components/PlacesAutocomplete')

describe('AppointmentInputForm', () => {
  const onSubmitMock = jest.fn()
  const onBackButtonPressMock = jest.fn()

  beforeAll(() => jest.useFakeTimers())
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.runOnlyPendingTimers()
  })
  afterAll(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('for an initial, pristine form no error is shown and the submit button is disabled', async () => {
    render(
      <AppointmentInputForm
        initialAppointment={getAppointmentDefaultInitialState()}
        space={space}
        onSubmit={onSubmitMock}
        onBackButtonPress={onBackButtonPressMock}
      />
    )

    const titleError = screen.queryByTestId('appointment-title-input-error-message')
    expect(titleError).not.toBeOnTheScreen()

    const submitButton = screen.getByRole('button', { name: /global.save/i })
    expect(submitButton).toBeDisabled()
  })

  it('changing a value for the first time shows error validation text', async () => {
    render(
      <AppointmentInputForm
        initialAppointment={getAppointmentDefaultInitialState()}
        space={space}
        onSubmit={onSubmitMock}
        onBackButtonPress={onBackButtonPressMock}
      />
    )
    // given a clean title field
    let titleError = screen.queryByTestId('appointment-title-input-error-message')
    expect(titleError).not.toBeOnTheScreen()

    // when changing description
    const descriptionInput = screen.getByLabelText(/spaces.appointments.input.description.label/i)
    await userEvent.type(descriptionInput, 'some description')

    // empty title field has error text
    titleError = await screen.findByTestId('appointment-title-input-error-message')
    expect(titleError).toBeOnTheScreen()
  })

  it('cannot submit form when missing a title', async () => {
    render(
      <AppointmentInputForm
        initialAppointment={getAppointmentDefaultInitialState()}
        space={space}
        onSubmit={onSubmitMock}
        onBackButtonPress={onBackButtonPressMock}
      />
    )

    // given just a description
    const descriptionInput = screen.getByLabelText(/spaces.appointments.input.description.label/i)
    await userEvent.type(descriptionInput, 'some description')

    // when submitting
    const submitButton = screen.getByRole('button', { name: /global.save/i })
    userEvent.press(submitButton)

    // then no submit handler was called
    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  it('should validate the `Title` input field', async () => {
    const TITLE_TEXT = 'test'

    render(
      <AppointmentInputForm
        initialAppointment={getAppointmentDefaultInitialState()}
        space={space}
        onSubmit={onSubmitMock}
        onBackButtonPress={onBackButtonPressMock}
      />
    )

    // shows error message when title is less than 2 characters
    let titleError = screen.queryByTestId(/appointment-title-input-error-message/i)
    expect(titleError).not.toBeOnTheScreen()

    let titleInput = screen.getByLabelText(/spaces.appointments.input.title.label/i)

    await userEvent.type(titleInput, TITLE_TEXT.slice(0, 1))
    await userEvent.press(screen.getByText(/spaces.appointments.input.inviteOnly.title/i))

    titleError = await screen.findByTestId(/appointment-title-input-error-message/i)
    expect(titleError).toBeOnTheScreen()

    // shows no error message when title is 2 characters or more
    titleInput = screen.getByLabelText(/spaces.appointments.input.title.label/i)
    await userEvent.type(titleInput, TITLE_TEXT)
    await userEvent.press(screen.getByText(/spaces.appointments.input.inviteOnly.title/i))

    expect(titleError).not.toBeOnTheScreen()
  })

  describe('should submit the form with valid data', () => {
    const title = 'Appointment Title'
    const description = 'Appointment Description'

    it('and `Invite only` + `Participants can edit` selection', async () => {
      render(
        <AppointmentInputForm
          initialAppointment={getAppointmentDefaultInitialState()}
          space={space}
          onSubmit={onSubmitMock}
          onBackButtonPress={onBackButtonPressMock}
        />
      )

      const titleInput = screen.getByLabelText(/spaces.appointments.input.title.label/i)
      await userEvent.type(titleInput, title)

      const descriptionInput = screen.getByLabelText(/spaces.appointments.input.description.label/i)
      await userEvent.type(descriptionInput, description)

      const whoCanAttendInputButton = screen.getByTestId('btn-appointment-invite-only-input')
      await userEvent.press(whoCanAttendInputButton)
      await userEvent.press(await screen.findByTestId('item-appointment-invite-only-input-INVITE_ONLY'))

      const permissionsInputButton = screen.getByTestId('btn-appointment-permission-input')
      await userEvent.press(permissionsInputButton)
      await userEvent.press(await screen.findByTestId('item-appointment-permission-input-PARTICIPANTS'))

      const submitButton = screen.getByRole('button', { name: /global.save/i })
      await userEvent.press(submitButton)

      expect(onSubmitMock).toHaveBeenCalled()
      const formReturnValue = onSubmitMock.mock.lastCall[0]

      expect(formReturnValue).toMatchInlineSnapshot(
        { startDateTime: expect.any(String), endDateTime: expect.any(String) },
        `
        {
          "description": "Appointment Description",
          "endDateTime": Any<String>,
          "inviteOnly": true,
          "locationDetails": undefined,
          "participantIds": [
            "user-1",
            "user-2",
            "user-3",
          ],
          "permission": "PARTICIPANTS",
          "spaceId": "1",
          "startDateTime": Any<String>,
          "thumbnail": undefined,
          "title": "Appointment Title",
          "videoCallInfo": undefined,
          "videoCallLink": undefined,
        }
      `
      )
    })

    it('and `Anyone` + `Only admins can edit` selection', async () => {
      render(
        <AppointmentInputForm
          initialAppointment={getAppointmentDefaultInitialState()}
          space={space}
          onSubmit={onSubmitMock}
          onBackButtonPress={onBackButtonPressMock}
        />
      )

      const titleInput = screen.getByLabelText(/spaces.appointments.input.title.label/i)
      await userEvent.type(titleInput, title)

      const descriptionInput = screen.getByLabelText(/spaces.appointments.input.description.label/i)
      await userEvent.type(descriptionInput, description)

      const permissionsInputButton = screen.getByTestId('btn-appointment-permission-input')
      await userEvent.press(permissionsInputButton)
      await userEvent.press(await screen.findByTestId('item-appointment-permission-input-ADMINS'))

      const submitButton = screen.getByRole('button', { name: /global.save/i })
      await userEvent.press(submitButton)

      expect(onSubmitMock).toHaveBeenCalled()
      const formReturnValue = onSubmitMock.mock.lastCall[0]

      expect(formReturnValue).toMatchInlineSnapshot(
        {
          startDateTime: expect.any(String),
          endDateTime: expect.any(String),
        },
        `
        {
          "description": "Appointment Description",
          "endDateTime": Any<String>,
          "inviteOnly": false,
          "locationDetails": undefined,
          "participantIds": [],
          "permission": "ADMINS",
          "spaceId": "1",
          "startDateTime": Any<String>,
          "thumbnail": undefined,
          "title": "Appointment Title",
          "videoCallInfo": undefined,
          "videoCallLink": undefined,
        }
      `
      )
    })
  })
})
