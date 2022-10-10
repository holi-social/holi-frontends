import {
  locateMultipleElementsWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../helpers/selectors'

const navigateToDonationsApp = async () => {
  await waitForElementWithTestId('home-feed-topics-heading')
  await tapOnElementWithTestId('home-apps-button')
  await tapOnElementWithTestId('app-tile-donations')
  await waitForElementWithTestId('donations-list-container')
}

describe('@Donations', () => {
  it('should be accessible from home screen', async () => {
    await navigateToDonationsApp()
  })

  it('should display multiple projects', async () => {
    await navigateToDonationsApp()

    // listItems only contains elements visible in viewport
    const listItems = await locateMultipleElementsWithTestId('donations-list-item')
    expect(listItems.length).toBeGreaterThan(1)
  })

  test('should display project details', async () => {
    await navigateToDonationsApp()
    // click first element in list
    await tapOnElementWithTestId('donations-list-item')

    await waitForElementWithTestId('donations-project-detail-heading')
  })
})
