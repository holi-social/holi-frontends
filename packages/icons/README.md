# @holi/icons

This package provides svg icon react components suited for use in react-native, and thus for all our frontends.
These components are generated from assets. 

This package uses svgr to transform svgs files from the designers workflwo to Svg components and optimize them in the process.

It also contains Icon-specific utility components which are used throughout the frontend project and Storybook stories for Icon Preview.

## Important bits

### Dynamic icons
Our frontends have dynamically colored and sized icons. 
It's important to data-bind props to the svg shapes and have them evaluate at runtime.
Svgr is doing that during transformation, based on a string replacement for a specific hex value in the design assets.


See the for the specific configuration for details.
[.svgrrc.cjs](.svgrrc.cjs)

### Building of components
The generated components are currently checked-in to source control. So you don't have to build them. 

After you add a new asset. Run ```yarn build``` to generate before use. Don't forget to add and push them.


## How to add a new icon
https://holi.atlassian.net/wiki/spaces/HOLI/pages/353009666/HoliIcon+-+How+to+use+the+Iconset


### Known Issues
- The component names clash with other libraries. e.g. "Global" or "Share". Pay attention while you auto-import them in the IDE.
- This package doesn't have { type: "module" } in the package.json, because this somehow breaks storybook.
