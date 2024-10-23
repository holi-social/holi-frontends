import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

import { createRelatedSpace, space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInfoView from '@holi/core/screens/spaces/details/components/SpaceInfoView'

describe('SpaceInfoView', () => {
  it('renders correctly', () => {
    render(<SpaceInfoView space={space} />)

    expect(screen.getByText('Space description')).toBeDefined()
    expect(screen.getByText('Hamburg, Germany')).toBeDefined()
    expect(screen.getByText('Animal Welfare')).toBeDefined()
    expect(screen.getByText('Environmental Protection')).toBeDefined()
    expect(screen.getByText('spaces.spaceDetails.publicLinks')).toBeDefined()
  })

  it('has a main space section', () => {
    const parentSpace = createRelatedSpace()
    render(<SpaceInfoView space={{ ...space, parentSpace }} />)

    expect(screen.getByText('spaces.spaceDetails.parentSpace')).toBeOnTheScreen()
    expect(screen.getByTestId('main-space-link')).toBeOnTheScreen()
  })

  describe('has a child spaces section', () => {
    it('with only one child space', () => {
      const childSpace = createRelatedSpace()
      render(<SpaceInfoView space={{ ...space, childSpaces: { totalResults: 1, data: [childSpace] } }} />)

      expect(screen.getByText('spaces.spaceDetails.relatedSpaces')).toBeOnTheScreen()
      expect(screen.getAllByTestId('related-space-item')).toHaveLength(1)

      // no 'view all' link
      expect(screen.queryByRole('link', { name: 'spaces.spaceDetails.relatedSpaces.viewAll' })).not.toBeOnTheScreen()
      // no 'see more' button in the slider
      expect(screen.queryByTestId('related-spaces-see-more')).not.toBeOnTheScreen()
    })

    it('with more then 4 child spaces', () => {
      const childSpaces = Array.from({ length: 4 }, () => createRelatedSpace())
      render(<SpaceInfoView space={{ ...space, childSpaces: { totalResults: 9999, data: childSpaces } }} />)

      expect(screen.getByText('spaces.spaceDetails.relatedSpaces')).toBeOnTheScreen()
      expect(screen.getAllByTestId('related-space-item')).toHaveLength(4)

      // no 'view all' link
      expect(screen.queryByRole('link', { name: 'spaces.spaceDetails.relatedSpaces.viewAll' })).toBeOnTheScreen()
      // no 'see more' button in the slider
      expect(screen.queryByTestId('related-spaces-see-more')).toBeOnTheScreen()
    })

    it('has an explenation modal about spaces relationships', async () => {
      const childSpaces = Array.from({ length: 4 }, () => createRelatedSpace())
      render(<SpaceInfoView space={{ ...space, childSpaces: { totalResults: 4, data: childSpaces } }} />)

      const modalButton = screen.getByRole('button', { name: 'spaces.spaceDetails.relatedSpaces.relationship.title' })
      await userEvent.press(modalButton)

      expect(screen.getByTestId('about-spaces-relationship-modal')).toBeOnTheScreen()
      expect(screen.getByText('spaces.spaceDetails.relatedSpaces.relationship.modal.title')).toBeOnTheScreen()
      expect(screen.getByText('spaces.spaceDetails.relatedSpaces.relationship.modal.description')).toBeOnTheScreen()
      const gotItModalButton = screen.getByRole('button', {
        name: 'spaces.spaceDetails.relatedSpaces.relationship.modal.close',
      })
      expect(gotItModalButton).toBeOnTheScreen()

      await userEvent.press(gotItModalButton)
      expect(screen.queryByTestId('about-spaces-relationship-modal')).not.toBeOnTheScreen()
    })
  })
})
