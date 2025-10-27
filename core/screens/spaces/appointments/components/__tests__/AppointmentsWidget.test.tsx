import { MockedProvider } from '@apollo/client/testing'
import { renderRouter, screen } from 'expo-router/testing-library'
import React from 'react'

import { PaginationContext } from '@holi/core/pagination/Pagination'
import { pagedAppointments, space } from '@holi/core/screens/spaces/__tests__/testData'
import AppointmentsWidget from '@holi/core/screens/spaces/appointments/components/AppointmentsWidget'

describe('AppointmentsWidget', () => {
  it('renders correctly if there are no appointments', () => {
    const paginationContext = {
      loading: false,
      data: [],
      totalResults: 0,
    }
    renderRouter({
      index: () => (
        <MockedProvider>
          <PaginationContext.Provider value={paginationContext}>
            <AppointmentsWidget space={space} />
          </PaginationContext.Provider>
        </MockedProvider>
      ),
    })
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when there are appointments', () => {
    const paginationContext = {
      loading: false,
      ...pagedAppointments,
    }
    renderRouter({
      index: () => (
        <MockedProvider>
          <PaginationContext.Provider value={paginationContext}>
            <AppointmentsWidget space={space} />
          </PaginationContext.Provider>
        </MockedProvider>
      ),
    })
    expect(screen.toJSON()).toMatchSnapshot()
  })
})
