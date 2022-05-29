Feature('startup')

Scenario('test something', ({ I }) => {
  // example distinction:
  // I.runOnIOS(() => { })
  // I.runOnAndroid(() => { })

  // I.seeAppIsInstalled('foundation.holistic.projectholi')
  I.see('Home', '#home-feed-title') // I.see() without given element id times out in iOs
  I.see('This week’s topics are Immigration, Education and Sustainability', '#home-feed-topics')
  I.tap('#app-tile-volunteering')
  I.waitForText('Volunteering App Home', 10)
  I.tap('#nav-button-home')
})
