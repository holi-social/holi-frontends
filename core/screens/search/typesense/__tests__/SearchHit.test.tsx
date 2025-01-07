import { faker } from '@faker-js/faker'
import { SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import { useUserLanguage } from '@holi/core/screens/search/typesense/hooks'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

const makeVolunteeringHit = (): SearchHitData => ({
  type: 'volunteering',
  id: faker.string.uuid(),
  title_de: faker.lorem.sentence(10),
  title_en: faker.lorem.sentence(10),
  description_de: faker.lorem.paragraph(5),
  description_en: faker.lorem.paragraph(5),
  location: faker.location.city(),
  location_lat_lng: [faker.location.latitude(), faker.location.latitude()],
  image_url: faker.image.url(),
  link_locators: {
    volunteering: faker.string.uuid(),
  },
})

const makeProfileHit = (): SearchHitData => {
  const fullName = faker.person.fullName()
  const aboutMe = faker.lorem.paragraph(5)
  return {
    type: 'profile',
    id: faker.string.uuid(),
    title_de: fullName,
    title_en: fullName,
    description_de: aboutMe,
    description_en: aboutMe,
    location: faker.location.city(),
    location_lat_lng: [faker.location.latitude(), faker.location.latitude()],
    image_url: faker.image.url(),
    link_locators: {
      profile: faker.string.uuid(),
    },
  }
}

const makeSpaceHit = (): SearchHitData => {
  const title = faker.lorem.words(10)
  const description = faker.lorem.paragraph(5)
  return {
    type: 'space',
    id: faker.string.uuid(),
    title_de: title,
    title_en: title,
    description_de: description,
    description_en: description,
    location: faker.location.city(),
    location_lat_lng: [faker.location.latitude(), faker.location.latitude()],
    image_url: faker.image.url(),
    link_locators: {
      space: faker.string.uuid(),
    },
  }
}

jest.mock('@holi/core/screens/search/typesense/hooks')
const useUserLanguageMock = jest.mocked(useUserLanguage)

describe('SearchHit', () => {
  it('correctly renders volunteering item (all fields, de)', async () => {
    useUserLanguageMock.mockReturnValue('de')

    const hit = makeVolunteeringHit()
    render(<SearchHit hit={hit} />)

    expect(screen.getByText(hit.title_de!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
    expect(screen.getByText(hit.location!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion

    const image = screen.getByRole('img')
    expect(image).toBeOnTheScreen()
    expect(image.props.source.uri).toBe(
      'https://dev-images.holi.social/crop:0:0/resize:fill-down:96:96/ext:webp/quality:80/plain/' +
        encodeURIComponent(hit.image_url!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    )
  })
  it('correctly renders volunteering item (all fields, en)', async () => {
    useUserLanguageMock.mockReturnValue('en')

    const hit = makeVolunteeringHit()
    render(<SearchHit hit={hit} />)

    expect(screen.getByText(hit.title_en!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
    expect(screen.getByText(hit.location!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion

    const image = screen.getByRole('img')
    expect(image).toBeOnTheScreen()
    expect(image.props.source.uri).toBe(
      'https://dev-images.holi.social/crop:0:0/resize:fill-down:96:96/ext:webp/quality:80/plain/' +
        encodeURIComponent(hit.image_url!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    )
  })
  it('falls back to en if de not available', async () => {
    useUserLanguageMock.mockReturnValue('de')

    const hit = {
      ...makeVolunteeringHit(),
      title_en: faker.lorem.sentence(10),
      title_de: undefined,
    }
    render(<SearchHit hit={hit} />)
    expect(screen.getByText(hit.title_en!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('falls back to de if en not available', async () => {
    useUserLanguageMock.mockReturnValue('en')

    const hit = {
      ...makeVolunteeringHit(),
      title_de: faker.lorem.sentence(10),
      title_en: undefined,
    }
    render(<SearchHit hit={hit} />)

    expect(screen.getByText(hit.title_de!)).toBeOnTheScreen() // eslint-disable-line @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (volunteering)', async () => {
    const user = userEvent.setup()

    const hit = makeVolunteeringHit()
    render(<SearchHit hit={hit} />)

    await user.press(screen.getByRole('link'))
    expect(mockNavigate).toHaveBeenCalledWith(`/volunteering/${hit.link_locators!.volunteering}`) // @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (user)', async () => {
    const user = userEvent.setup()

    const hit = makeProfileHit()
    render(<SearchHit hit={hit} />)

    await user.press(screen.getByRole('link'))
    expect(mockNavigate).toHaveBeenCalledWith(`/profile/${hit.link_locators!.profile}`) // @typescript-eslint/no-non-null-assertion
  })
  it('renders the correct link (space)', async () => {
    const user = userEvent.setup()

    const hit = makeSpaceHit()
    render(<SearchHit hit={hit} />)

    await user.press(screen.getByRole('link'))
    expect(mockNavigate).toHaveBeenCalledWith(`/spaces/${hit.link_locators!.space}`) // @typescript-eslint/no-non-null-assertion
  })
})
