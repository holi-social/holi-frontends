Feature('@HomeScreen')

Scenario('should work', ({ I }) => {
  I.seeElementWithTestId('home-feed-topics-heading')

  I.tapOnElementWithTestId('app-tile-volunteering')
  I.waitForText('Volunteering', 10)

  I.tapOnElementWithTestId('nav-button-home')
  I.seeElementWithTestId('home-feed-topics-heading')
})
