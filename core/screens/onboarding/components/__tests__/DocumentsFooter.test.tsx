import { useDocumentModal } from '@holi/core/screens/onboarding/components/DocumentModal'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library'
import React from 'react'

const mockUseDocumentModal = useDocumentModal as jest.Mock
jest.mock('@holi/core/screens/onboarding/components/DocumentModal', () => {
  const original = jest.requireActual('@holi/core/screens/onboarding/components/DocumentModal')
  return {
    ...original,
    useDocumentModal: jest.fn(),
  }
})

describe('DocumentsFooter', () => {
  const mockShowDocModal = jest.fn()

  beforeEach(() => {
    mockUseDocumentModal.mockReturnValue({ show: mockShowDocModal, modalProps: {} })
  })

  it('should hide imprint if prop to display imprint is false', () => {
    renderRouter({
      index: () => <DocumentsFooter />,
    })

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
  })

  it('should render imprint if prop to display imprint is true', () => {
    renderRouter({
      index: () => <DocumentsFooter displayImprint={true} />,
    })

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)

    expect(links[2]).toHaveTextContent(/imprint/)
  })

  const documentsInOrder = ['privacyPolicy', 'termsOfUse', 'imprint']
  it.each(documentsInOrder)('should open modal for document %s', (document) => {
    const linkIndex = documentsInOrder.indexOf(document)

    renderRouter({
      index: () => <DocumentsFooter displayImprint={true} />,
    })

    fireEvent.press(screen.getAllByRole('link')[linkIndex])

    expect(mockShowDocModal).toHaveBeenCalledWith(document)
  })
})
