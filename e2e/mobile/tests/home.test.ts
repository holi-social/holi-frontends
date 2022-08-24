Feature('startup')

Scenario('test something', ({ I }) => {
  // example distinction:
  // I.runOnIOS(() => { })
  // I.runOnAndroid(() => { })

  // I.seeAppIsInstalled('foundation.holistic.projectholi')

  // I.see() without selector takes much more time and may time out

  I.seeTextWithTestId('This week’s topics are', 'home-feed-topics-heading')

  I.tapOnElementWithTestId('app-tile-volunteering')
  I.waitForText('Volunteering', 10)

  I.tapOnElementWithTestId('nav-button-home')
})
