Feature('startup')

Scenario('test something', ({ I }) => {
  // example distinction:
  // I.runOnIOS(() => { })
  // I.runOnAndroid(() => { })

  // I.seeAppIsInstalled('foundation.holistic.projectholi')
  // awaiting app startup
  I.waitForText('Hello Anna', 10)
  I.see('Hello Anna', '#private-space-header-greeting') // I.see() without given element id times out in iOs
  I.see('Nice to see you here!', '#private-space-header-sub')
  I.tap('#app-tile-community')
  I.waitForText('CommunityHome', 10)
  I.tap('#communityHomeButton')
})
