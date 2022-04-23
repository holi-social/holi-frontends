Feature('startup')

Scenario('test something', ({ I }) => {
  I.runOnIOS(() => {
    // run something ios-specific here
  })
  I.runOnAndroid(() => {
    I.seeAppIsInstalled('foundation.holistic.projectholi')
  })

  // only works for web
  // following https://codecept.io/mobile-react-native-locators.html, but did not get it to work
  //I.waitForElement('//*[@view-tag="componentsButton"]', 10)

  I.waitForText('Hello Anna', 10)
  I.tap('Community')
  I.waitForText('Feed', 10)

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
