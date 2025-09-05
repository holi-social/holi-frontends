import * as React from 'react'
const SvgLogoGoogle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <mask
      id="logo-google_svg__a"
      width={20}
      height={20}
      x={2}
      y={2}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'luminance',
      }}
    >
      <path fill="#fff" d="M22 2H2v20h20z" />
    </mask>
    <g mask="url(#logo-google_svg__a)">
      <path
        fill="#4285F4"
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.596-4.123h-3.34v2.59A10 10 0 0 0 12 22"
      />
      <path
        fill="#FBBC04"
        d="M6.405 13.9c-.2-.6-.314-1.24-.314-1.9s.114-1.3.313-1.9V7.51h-3.34A10 10 0 0 0 2 12c0 1.614.386 3.14 1.064 4.49z"
      />
      <path
        fill="#E94235"
        d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.959 2.99 14.695 2 12 2 8.09 2 4.709 4.24 3.063 7.51l3.341 2.59C7.191 7.736 9.395 5.977 12 5.977"
      />
    </g>
  </svg>
)
export default SvgLogoGoogle
