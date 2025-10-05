import React from 'react'
import { DocumentModal, useDocumentModal } from '@holi/core/screens/onboarding/components/DocumentModal'
import { act, renderHook } from '@testing-library/react-hooks'
import { render, screen } from 'expo-router/testing-library'

describe('useDocumentModal', () => {
  it('should not show modal initially', () => {
    const { result } = renderHook(() => useDocumentModal())

    expect(result.current.visible).toBeFalsy()
    expect(result.current.modalProps.shown).toBeFalsy()
    expect(result.current.modalProps.documentURL).toBeUndefined()
  })

  it('should show modal for document', () => {
    const { result } = renderHook(() => useDocumentModal())

    act(() => result.current.show('imprint'))

    expect(result.current.visible).toBeTruthy()
    expect(result.current.modalProps.shown).toBeTruthy()
  })

  it('should close modal on dismiss', () => {
    const { result } = renderHook(() => useDocumentModal())

    act(() => result.current.show('imprint'))

    expect(result.current.visible).toBeTruthy()
    expect(result.current.modalProps.shown).toBeTruthy()

    act(() => result.current.modalProps.onDismiss?.())

    expect(result.current.visible).toBeFalsy()
    expect(result.current.modalProps.shown).toBeFalsy()
  })

  it('should generate url for document to show', () => {
    const { result } = renderHook(() => useDocumentModal())

    act(() => result.current.show('imprint'))

    expect(result.current.modalProps.documentURL).toMatch('/api/documents?type=imprint')
  })
})

describe('DocumentsModal', () => {
  it('should render nothing if not visible', () => {
    render(<DocumentModal shown={false} />)

    expect(screen.queryByLabelText('profile.settings.legalDocuments.title')).not.toBeOnTheScreen()
  })

  it('should render modal if visible', () => {
    render(<DocumentModal shown={true} />)

    expect(screen.getByLabelText('profile.settings.legalDocuments.title')).toBeOnTheScreen()
  })
})
