import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgGoodDeeds = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#goodDeeds_svg__a)">
      <G clipPath="url(#goodDeeds_svg__b)">
        <Path
          fill="#D9F4FF"
          d="M12.024 3.653a6.78 6.78 0 0 0-9.59 0c-2.708 2.707-2.854 7.15-.104 9.9l8.29 8.29a1.732 1.732 0 0 0 2.45-2.45l1.098 1.1a1.732 1.732 0 0 0 2.452-2.447l.813.813a1.732 1.732 0 0 0 2.449-2.45l-.793-.792c.684.654 1.974.677 2.611-.023.644-.708.305-1.893-.066-2.264L14.77 6.476z"
        />
        <Path
          stroke="currentColor"
          d="m11.31 17.635 1.76 1.759m0 0a1.732 1.732 0 0 1-2.45 2.449l-8.29-8.29c-2.75-2.75-2.604-7.193.103-9.9a6.78 6.78 0 0 1 9.59 0l2.747 2.823 6.864 6.854c.371.371.71 1.556.066 2.264-.637.7-1.927.677-2.61.023m-6.02 3.777 1.098 1.098a1.732 1.732 0 0 0 2.452-2.446m2.47-2.429.792.793a1.732 1.732 0 0 1-2.45 2.449l-2.856-2.857m4.514-.385c-1.259-1.204-2.467-2.465-3.698-3.697"
        />
        <Path
          fill="#90DDFF"
          stroke="currentColor"
          d="M21.633 13.33c2.706-2.706 2.714-6.87.009-9.575a6.927 6.927 0 0 0-9.797 0l-3.444 3.53a2.02 2.02 0 0 0 2.891 2.822l3.476-3.643z"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="goodDeeds_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
      <ClipPath id="goodDeeds_svg__b">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgGoodDeeds
