Feature('startup')

const testID = (testID) => {
  return { android: `//*[@view-tag="${testID}"]`, ios: `~${testID}` }
}

Scenario('test something', ({ I }) => {
  // example distinction:
  // I.runOnIOS(() => { })
  // I.runOnAndroid(() => { })

  // I.seeAppIsInstalled('foundation.holistic.projectholi')
  // awaiting app startup
  I.waitForText('Home', 10)
  I.see('Home', '~home-feed-title') // I.see() without given element id times out in iOs
  I.see('This week’s topics are Immigration, Education and Sustainability', '~home-feed-topics')
  I.tap('~app-tile-volunteering')
  I.waitForText('Volunteering App Home', 10)
  I.tap(testID('nav-button-home'))
})
