import React from 'react'

interface HoliImagePickerProps {
  imagePickerOptions: unknown
  getChildren: (actionHandler: () => Promise<unknown | undefined>) => React.ReactNode
}

export const HoliImagePicker: React.VFC<HoliImagePickerProps> = ({ getChildren }) => {
  return (
    <>
      <input type="file" accept="image/*" />

      {getChildren(async () => undefined)}
    </>
  )
}
