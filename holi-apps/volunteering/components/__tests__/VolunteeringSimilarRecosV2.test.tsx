import React from 'react'
import { render, screen } from '@testing-library/react-native'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { useVolunteeringSimilarRecosV2 } from '@holi-apps/volunteering/hooks/useVolunteeringSimilarRecosV2'
import { VolunteeringSimilarRecosV2 } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosV2'

const mockUseVolunteeringSimilarRecosV2 = jest.mocked(useVolunteeringSimilarRecosV2)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringSimilarRecosV2', () => ({
  useVolunteeringSimilarRecosV2: jest.fn(),
}))

const createDocuments = (length: number): LocalizedTypesenseDocument[] =>
  Array.from(
    { length },
    (_, i) =>
      ({
        id: i.toString(),
        type: 'volunteering',
        title: `Titel ${i}`,
        description: '',
        external_url: `https://example.com/engagement${i}`,
        source: 'Aktion Mensch',
      }) as LocalizedTypesenseDocument
  )

describe('VolunteeringSimilarRecosV2', () => {
  const testDocumentId = 'volunteering_123'

  it('should fetch recommendations with correct page size', () => {
    mockUseVolunteeringSimilarRecosV2.mockReturnValue(createDocuments(4))

    render(<VolunteeringSimilarRecosV2 documentId={testDocumentId} />)

    expect(mockUseVolunteeringSimilarRecosV2).toHaveBeenCalledWith({
      documentId: testDocumentId,
      pageSize: 4,
    })
  })

  it('should display nothing if there are no recommendations', () => {
    mockUseVolunteeringSimilarRecosV2.mockReturnValue([])

    render(<VolunteeringSimilarRecosV2 documentId={testDocumentId} />)

    expect(screen.queryByText('recommendation.slider.title')).not.toBeOnTheScreen()
  })

  it('should display similar recommendations', () => {
    mockUseVolunteeringSimilarRecosV2.mockReturnValue(createDocuments(4))

    render(<VolunteeringSimilarRecosV2 documentId={testDocumentId} />)

    expect(screen.getByText('recommendation.slider.title')).toBeOnTheScreen()
    expect(screen.queryAllByTestId('volunteering-reco-card')).toHaveLength(4)
  })
})
