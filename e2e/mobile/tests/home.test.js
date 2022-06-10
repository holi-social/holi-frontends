Feature('startup')

Scenario('test something', ({ I }) => {
  // example distinction:
  // I.runOnIOS(() => { })
  // I.runOnAndroid(() => { })

  // I.seeAppIsInstalled('foundation.holistic.projectholi')

  // I.see() without selector takes much more time and may time out
  I.seeTextWithTestId('Home', 'home-feed-title')
  I.seeTextWithTestId('This week’s topics are Immigration, Education and Sustainability', 'home-feed-topics')

  I.tapOnElementWithTestId('app-tile-volunteering')
  I.waitForText('Volunteering App Home', 10)

  I.tapOnElementWithTestId('nav-button-home')
})
