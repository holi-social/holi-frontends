Feature('startup')

const testID = (testID) => {
  return { android: `//*[@view-tag="${testID}"]`, ios: `~${testID}` }
}

Scenario('test something', ({ I }) => {
  I.runOnIOS(() => {
    // run something ios-specific here
    I.see('Hello Anna', '~private-space-header-greeting')
    I.see('Nice to see you here!', '~private-space-header-sub')
    I.tap('~app-tile-community')
    I.waitForText('CommunityHome', 10)
    I.tap('#communityHomeButton')
  })
  I.runOnAndroid(() => {
    // I.seeAppIsInstalled('foundation.holistic.projectholi')
    I.waitForText('Hello Anna', 10)
    I.waitForText('Nice to see you here!', 10)
    I.tap('Community')
    I.waitForText('CommunityHome', 10)
    I.tap('#communityHomeButton')
  })

  // only works for web
  // following https://codecept.io/mobile-react-native-locators.html, but did not get it to work
  //I.waitForElement('//*[@view-tag="componentsButton"]', 10)

  // this works
  //I.waitForElement('//android.view.ViewGroup[@content-desc="purePressable"]', 10)
  // same as the following shortcut
  //I.waitForElement('~purePressable', 10)
  // via resource-id works
  //I.waitForElement('//*[@resource-id="purePressable"]', 10)
  // same as the following shortcut
  //I.waitForElement('#purePressable', 10)

  // accessible=true and accessibleLabel="purePressable" did not end up as properties on the components
  //I.tap('~purePressable')
  //I.tap('//*[@view-tag="purePressable"]')
  //I.tap('Click Me (pure pressable)')
  //I.waitForText('You clicked 1 times', 10)
  //I.seeElement('#foundation.holistic.projectholi:id/buttonComponent')
  //I.tap('Click Me (Button component)')
  //I.waitForText('You clicked 2 times', 10)
})
