Feature('startup')

const testID = (testID) =>
  // { android: `//*[@view-tag="${testID}"]`, ios: `~${testID}` }
  ({ android: `#${testID}`, ios: `~${testID}` })

Scenario('test something', ({ I }) => {
  // example distinction:
  // I.runOnIOS(() => { })
  // I.runOnAndroid(() => { })

  // I.seeAppIsInstalled('foundation.holistic.projectholi')
  I.see('Home', testID('home-feed-title')) // I.see() without given element id times out in iOs
  I.see('This week’s topics are Immigration, Education and Sustainability', testID('home-feed-topics'))

  I.tapOnElementWithTestId('app-tile-volunteering')
  I.waitForText('Volunteering App Home', 10)

  I.tapOnElementWithTestId('nav-button-home')
})
