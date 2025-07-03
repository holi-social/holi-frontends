import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { VolunteeringFilterRow } from '@holi-apps/volunteering/components/VolunteeringFilterRow'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

const emptyFilter = {
  location: undefined,
  topics: undefined,
  skills: undefined,
  commitmentLabels: undefined,
  commitmentDurations: undefined,
}

const location: GeolocationSuggestion = {
  id: '42',
  label: 'Hamburg, Germany',
}

describe('VolunteeringFilterRow', () => {
  it('should render filter chips in correct order', () => {
    render(<VolunteeringFilterRow filters={emptyFilter} onSubmit={jest.fn()} />)

    const filters = screen.getAllByRole('switch')
    expect(filters[0]).toHaveTextContent('location')
    expect(filters[1]).toHaveTextContent('topics')
    expect(filters[2]).toHaveTextContent('commitmentDurations')
    expect(filters[3]).toHaveTextContent('commitmentLabels')
    expect(filters[4]).toHaveTextContent('skills')
  })

  it('should use correct label for unselected filters', () => {
    render(<VolunteeringFilterRow filters={emptyFilter} onSubmit={jest.fn()} />)

    expect(screen.getByText('volunteering.filter.location.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.topics.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.commitmentDurations.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.commitmentLabels.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.skills.label')).toBeOnTheScreen()
  })

  it('should sort selected filter chips to the front', () => {
    render(
      <VolunteeringFilterRow
        filters={{
          topics: ['topic-1'],
          commitmentLabels: ['commitment-1'],
        }}
        onSubmit={jest.fn()}
      />
    )

    const filters = screen.getAllByRole('switch')
    expect(filters[0]).toHaveTextContent('topic')
    expect(filters[1]).toHaveTextContent('commitment_label')
    expect(filters[2]).toHaveTextContent('location')
    expect(filters[3]).toHaveTextContent('commitmentDurations')
    expect(filters[4]).toHaveTextContent('skills')
  })

  it('should use correct label for selected filters', () => {
    render(
      <VolunteeringFilterRow
        filters={{
          location,
          topics: ['topic-1', 'topic-2'],
          skills: ['skill-1', 'skill-2', 'skill-3'],
          commitmentDurations: ['duration-1'],
          commitmentLabels: ['commitment-1'],
        }}
        onSubmit={jest.fn()}
      />
    )

    expect(screen.getByText('Hamburg, Germany')).toBeOnTheScreen()
    expect(screen.getByText('topic.topic-1 + 1')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_duration.duration-1')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_label.commitment-1')).toBeOnTheScreen()
    expect(screen.getByText('skill.skill-1 + 2')).toBeOnTheScreen()
  })
})
