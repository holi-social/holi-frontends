// import { fireEvent, render } from '@testing-library/react-native'
// import React from 'react'
// import renderer from 'react-test-renderer'

// import { Example as HoliAppSwiper } from '@holi/ui/components/organisms/__stories__/HoliAppSwiper.stories'

// describe('HoliAppSwiper', () => {
//   const apps = HoliAppSwiper.args?.apps || []
//   const moreAppsLabel = 'More apps...'

//   it('renders correctly', () => {
//     const tree = renderer.create(<HoliAppSwiper apps={apps} moreAppsLabel={moreAppsLabel} />).toJSON()
//     expect(tree).toMatchSnapshot()
//   })

//   describe('displays the app tiles correctly', () => {
//     it('displays all app tiles', () => {
//       const { getByText, getAllByRole } = render(<HoliAppSwiper apps={apps} moreAppsLabel={moreAppsLabel} />)
//       const buttons = getAllByRole('button')

//       // Expect additional button for 'More apps...'
//       expect(buttons.length).toBe(apps.length + 1)
//       apps.forEach((app) => {
//         expect(getByText(app.name)).toBeDefined()
//       })
//     })

//     it('handles press on app tiles', () => {
//       const navigate = jest.fn()
//       const pressableApps = apps.map((app) => ({
//         ...app,
//         onPress: () => navigate(app.name),
//       }))
//       const { getByText } = render(<HoliAppSwiper apps={pressableApps} moreAppsLabel={moreAppsLabel} />)

//       fireEvent.press(getByText('Donations'))
//       expect(navigate).toHaveBeenCalledWith('Donations')
//     })

//     it('handles press on button for more apps', () => {
//       const navigate = jest.fn()
//       const { getByText } = render(
//         <HoliAppSwiper apps={apps} moreAppsLabel={moreAppsLabel} onPressMoreApps={navigate} />
//       )

//       fireEvent.press(getByText(moreAppsLabel))
//       expect(navigate).toHaveBeenCalled()
//     })
//   })
// })
