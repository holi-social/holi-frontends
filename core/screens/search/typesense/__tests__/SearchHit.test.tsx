import { faker } from '@faker-js/faker'
import { SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import { useUserLanguage } from '@holi/core/screens/search/typesense/hooks/useUserLanguage'
import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'
import { testTrackingEvent } from '@holi/core/components/__tests__/Trackable.test'
import { volunteeringHit, spaceHit, profileHit } from '@holi/core/screens/search/typesense/__tests__/testData'

jest.mock('@holi/core/screens/search/typesense/hooks/useUserLanguage')
const useUserLanguageMock = jest.mocked(useUserLanguage)

describe('SearchHit', () => {
  it('correctly renders volunteering item (all fields, de)', async () => {
    useUserLanguageMock.mockReturnValue('de')

    const hit = volunteeringHit
    render(<SearchHit hit={hit} trackingEvent={testTrackingEvent} />)

    expect(screen.getByText(hit.title_de!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
    expect(screen.getByText(hit.location!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion

    const image = screen.getByRole('img')
    expect(image).toBeOnTheScreen()
    expect(image.props.source).toBe(
      'https://dev-images.holi.social/crop:0:0/resize:fill-down:96:96/ext:webp/quality:80/plain/' +
        encodeURIComponent(hit.image_url!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    )
  })
  it('correctly renders volunteering item (all fields, en)', async () => {
    useUserLanguageMock.mockReturnValue('en')

    const hit = volunteeringHit
    render(<SearchHit hit={hit} trackingEvent={testTrackingEvent} />)

    expect(screen.getByText(hit.title_en!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
    expect(screen.getByText(hit.location!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion

    const image = screen.getByRole('img')
    expect(image).toBeOnTheScreen()
    expect(image.props.source).toBe(
      'https://dev-images.holi.social/crop:0:0/resize:fill-down:96:96/ext:webp/quality:80/plain/' +
        encodeURIComponent(hit.image_url!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    )
  })
  it('falls back to en if de not available', async () => {
    useUserLanguageMock.mockReturnValue('de')

    const hit = {
      ...volunteeringHit,
      title_en: faker.lorem.sentence(10),
      title_de: undefined,
    }
    render(<SearchHit hit={hit} trackingEvent={testTrackingEvent} />)
    expect(screen.getByText(hit.title_en!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('falls back to de if en not available', async () => {
    useUserLanguageMock.mockReturnValue('en')

    const hit = {
      ...volunteeringHit,
      title_de: faker.lorem.sentence(10),
      title_en: undefined,
    }
    render(<SearchHit hit={hit} trackingEvent={testTrackingEvent} />)

    expect(screen.getByText(hit.title_de!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (volunteering)', async () => {
    const user = userEvent.setup()

    const hit = volunteeringHit
    render(<SearchHit hit={hit} trackingEvent={testTrackingEvent} />)

    await user.press(screen.getByRole('link'))
    expect(mockNavigate).toHaveBeenCalledWith(`/volunteering/${hit.link_locators!.volunteering}`) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (user)', async () => {
    const user = userEvent.setup()

    const hit = profileHit
    render(<SearchHit hit={hit} trackingEvent={testTrackingEvent} />)

    await user.press(screen.getByRole('link'))
    expect(mockNavigate).toHaveBeenCalledWith(`/profile/${hit.link_locators!.profile}`) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (space)', async () => {
    const user = userEvent.setup()

    const hit = spaceHit
    render(<SearchHit hit={hit} trackingEvent={testTrackingEvent} />)

    await user.press(screen.getByRole('link'))
    expect(mockNavigate).toHaveBeenCalledWith(`/spaces/${hit.link_locators!.space}`) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('correctly renders profile item with user_full_name', async () => {
    useUserLanguageMock.mockReturnValue('de')

    const hit = profileHit
    render(<SearchHit hit={hit} trackingEvent={testTrackingEvent} />)

    expect(screen.getByText(hit.user_full_name!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
})
