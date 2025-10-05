import { faker } from '@faker-js/faker'
import { SearchHit } from '@holi/core/screens/search/SearchHit'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { renderRouter, render, screen, fireEvent } from 'expo-router/testing-library'
import React from 'react'
import { Text } from 'react-native'
import { testTrackingEvent } from '@holi/core/components/__tests__/Trackable.test'
import { volunteeringHit, spaceHit, profileHit } from '@holi/core/screens/search/__tests__/testData'

jest.mock('@holi/core/screens/search/hooks/useUserLanguage')

const useUserLanguageMock = jest.mocked(useUserLanguage)

describe('SearchHit', () => {
  it('correctly renders volunteering item (all fields, de)', () => {
    useUserLanguageMock.mockReturnValue('de')

    const hit = volunteeringHit
    renderRouter({ index: () => <SearchHit hit={hit} trackingEvent={testTrackingEvent} /> })

    expect(screen.getByText(hit.title_de!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
    expect(screen.getByText(hit.location!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion

    const image = screen.getByRole('img')
    expect(image).toBeOnTheScreen()
    expect(image.props.source).toBe(
      'https://dev-images.holi.social/crop:0:0/resize:fill-down:96:96/ext:webp/quality:80/plain/' +
        encodeURIComponent(hit.image_url!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    )
  })
  it('correctly renders volunteering item (all fields, en)', () => {
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
  it('falls back to en if de not available', () => {
    useUserLanguageMock.mockReturnValue('de')

    const hit = {
      ...volunteeringHit,
      title_en: faker.lorem.sentence(10),
      title_de: undefined,
    }
    renderRouter({ index: () => <SearchHit hit={hit} trackingEvent={testTrackingEvent} /> })
    expect(screen.getByText(hit.title_en!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('falls back to de if en not available', () => {
    useUserLanguageMock.mockReturnValue('en')

    const hit = {
      ...volunteeringHit,
      title_de: faker.lorem.sentence(10),
      title_en: undefined,
    }
    renderRouter({ index: () => <SearchHit hit={hit} trackingEvent={testTrackingEvent} /> })

    expect(screen.getByText(hit.title_de!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (volunteering)', () => {
    const hit = volunteeringHit
    const context = renderRouter({
      index: () => <SearchHit hit={hit} trackingEvent={testTrackingEvent} />,
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(screen.getByRole('link'))
    expect(context).toHavePathname(`/volunteering/${hit.link_locators!.volunteering}`) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (user)', () => {
    const hit = profileHit
    const context = renderRouter({
      index: () => <SearchHit hit={hit} trackingEvent={testTrackingEvent} />,
      'profile/[id]': () => <Text>Profile</Text>,
    })

    fireEvent.press(screen.getByRole('link'))
    expect(context).toHavePathname(`/profile/${hit.link_locators!.profile}`) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (space)', () => {
    const hit = spaceHit
    const context = renderRouter({
      index: () => <SearchHit hit={hit} trackingEvent={testTrackingEvent} />,
      'spaces/[spaceSlug]': () => <Text>Space</Text>,
    })

    fireEvent.press(screen.getByRole('link'))
    expect(context).toHavePathname(`/spaces/${hit.link_locators!.space}`) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('correctly renders profile item with user_full_name', () => {
    useUserLanguageMock.mockReturnValue('de')

    const hit = profileHit
    renderRouter({ index: () => <SearchHit hit={hit} trackingEvent={testTrackingEvent} /> })

    expect(screen.getByText(hit.user_full_name!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
})
