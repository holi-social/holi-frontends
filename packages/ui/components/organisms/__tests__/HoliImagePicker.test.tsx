import { renderHook } from '@testing-library/react-native'
import * as ExpoFileSystem from 'expo-file-system'
import * as ExpoImageManipulator from 'expo-image-manipulator'
import * as ExpoImagePicker from 'expo-image-picker'

import { useMediaLibraryImagePicker } from '@holi/ui/components/organisms/HoliImagePicker/useMediaLibraryImagePicker'

describe('HoliImagePicker', () => {
  describe('useMediaLibraryImagePicker hooks pickImages() function', () => {
    it('returns `missingPermissions` string value if system permissions were not verified', async () => {
      jest.spyOn(ExpoImagePicker, 'useMediaLibraryPermissions').mockReturnValue([null, jest.fn(), jest.fn()])

      const { result } = renderHook(useMediaLibraryImagePicker)

      const pickImageResult = await result.current.pickImages({ type: 'unlimited' })
      expect(pickImageResult).toBe('missingPermissions')
    })

    it('returns `technicalError` string value if launchImageLibraryAsync() throws an error', async () => {
      jest
        .spyOn(ExpoImagePicker, 'useMediaLibraryPermissions')
        .mockReturnValue([
          { status: ExpoImagePicker.PermissionStatus.GRANTED, granted: true, expires: 'never', canAskAgain: true },
          jest.fn(),
          jest.fn(),
        ])
      jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync').mockRejectedValue(new Error('Dummy Error'))

      const { result } = renderHook(useMediaLibraryImagePicker)

      const pickImageResult = await result.current.pickImages({ type: 'unlimited' })
      expect(pickImageResult).toBe('technicalError')
    })

    describe('with fileSizeLimitation.type', () => {
      it("'unlimited' value returns original image result", async () => {
        jest
          .spyOn(ExpoImagePicker, 'useMediaLibraryPermissions')
          .mockReturnValue([
            { status: ExpoImagePicker.PermissionStatus.GRANTED, granted: true, expires: 'never', canAskAgain: true },
            jest.fn(),
            jest.fn(),
          ])
        const imageResult: ExpoImagePicker.ImagePickerResult = {
          canceled: false,
          assets: [
            {
              uri: 'dummyUri',
              assetId: '123',
              width: 6000,
              height: 9000,
              type: 'image',
            },
          ],
        }
        jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync').mockResolvedValue(imageResult)

        const { result } = renderHook(useMediaLibraryImagePicker)

        const pickImageResult = await result.current.pickImages({ type: 'unlimited' })
        expect(pickImageResult).toStrictEqual(imageResult)
      })

      it("'resize' value tries to resize image", async () => {
        const limitBytes = 8 * 1024 * 1024
        const mockedBytes = 200 * 1024 * 1024
        jest
          .spyOn(ExpoImagePicker, 'useMediaLibraryPermissions')
          .mockReturnValue([
            { status: ExpoImagePicker.PermissionStatus.GRANTED, granted: true, expires: 'never', canAskAgain: true },
            jest.fn(),
            jest.fn(),
          ])
        jest.spyOn(ExpoFileSystem, 'getInfoAsync').mockResolvedValue({
          exists: true,
          uri: 'dommyUri',
          size: mockedBytes,
          isDirectory: false,
          modificationTime: 100000,
        })
        const imageResult: ExpoImagePicker.ImagePickerResult = {
          canceled: false,
          assets: [
            {
              uri: 'dummyUri',
              assetId: '123',
              width: 6000,
              height: 9000,
              type: 'image',
            },
          ],
        }
        jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync').mockResolvedValue(imageResult)
        const expectedManipulateAsyncParams = {
          uri: 'dummyManipulatedUri',
          width: 3840,
          height: 4000,
        }
        const manipulateAsyncMock = jest
          .spyOn(ExpoImageManipulator, 'manipulateAsync')
          .mockResolvedValue(expectedManipulateAsyncParams)

        const { result } = renderHook(useMediaLibraryImagePicker)

        await result.current.pickImages({
          type: 'resize',
          limitBytes: limitBytes,
          resizeWidth: 3840,
        })

        expect(manipulateAsyncMock).toHaveBeenCalledWith('dummyUri', [{ resize: { width: 3840 } }], {
          compress: 0.8,
          format: ExpoImageManipulator.SaveFormat.JPEG,
          base64: false,
        })
      })

      it("'resize' value does not resize image if below of (or equal to) limit", async () => {
        const limitBytes = 8 * 1024 * 1024
        const mockedBytes = 8 * 1024 * 1024
        jest
          .spyOn(ExpoImagePicker, 'useMediaLibraryPermissions')
          .mockReturnValue([
            { status: ExpoImagePicker.PermissionStatus.GRANTED, granted: true, expires: 'never', canAskAgain: true },
            jest.fn(),
            jest.fn(),
          ])
        jest.spyOn(ExpoFileSystem, 'getInfoAsync').mockResolvedValue({
          exists: true,
          uri: 'dommyUri',
          size: mockedBytes,
          isDirectory: false,
          modificationTime: 100000,
        })
        const imageResult: ExpoImagePicker.ImagePickerResult = {
          canceled: false,
          assets: [
            {
              uri: 'dummyUri',
              assetId: '123',
              width: 6000,
              height: 9000,
              type: 'image',
            },
          ],
        }
        jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync').mockResolvedValue(imageResult)
        const manipulateAsyncMock = jest.spyOn(ExpoImageManipulator, 'manipulateAsync')

        const { result } = renderHook(useMediaLibraryImagePicker)

        await result.current.pickImages({
          type: 'resize',
          limitBytes: limitBytes,
          resizeWidth: 3840,
        })

        expect(manipulateAsyncMock).not.toHaveBeenCalled()
      })

      describe("'reject' value", () => {
        it('rejects image if image size is above `limitBytes`', async () => {
          const limitBytes = 8 * 1024 * 1024
          const mockedBytes = limitBytes + 1

          jest.spyOn(ExpoImagePicker, 'useMediaLibraryPermissions').mockReturnValue([
            {
              status: ExpoImagePicker.PermissionStatus.GRANTED,
              granted: true,
              expires: 'never',
              canAskAgain: true,
            },
            jest.fn(),
            jest.fn(),
          ])
          jest.spyOn(ExpoFileSystem, 'getInfoAsync').mockResolvedValue({
            exists: true,
            uri: 'dommyUri',
            size: mockedBytes,
            isDirectory: false,
            modificationTime: 100000,
          })
          const imageResult: ExpoImagePicker.ImagePickerResult = {
            canceled: false,
            assets: [
              {
                uri: 'dummyUri',
                assetId: '123',
                width: 6000,
                height: 9000,
                type: 'image',
              },
            ],
          }
          jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync').mockResolvedValue(imageResult)

          const { result } = renderHook(useMediaLibraryImagePicker)

          const pickImageResult = await result.current.pickImages({ type: 'reject', limitBytes })
          expect(pickImageResult).toBe('invalidFileSize')
        })

        it('returns original image result if image pass `limitBytes` conditions', async () => {
          jest.spyOn(ExpoImagePicker, 'useMediaLibraryPermissions').mockReturnValue([
            {
              status: ExpoImagePicker.PermissionStatus.GRANTED,
              granted: true,
              expires: 'never',
              canAskAgain: true,
            },
            jest.fn(),
            jest.fn(),
          ])
          jest.spyOn(ExpoFileSystem, 'getInfoAsync').mockResolvedValue({
            exists: true,
            uri: 'dommyUri',
            size: 1 * 1024 * 1024, // smaller size
            isDirectory: false,
            modificationTime: 100000,
          })
          const imageResult: ExpoImagePicker.ImagePickerResult = {
            canceled: false,
            assets: [
              {
                uri: 'dummyUri',
                assetId: '123',
                width: 6000,
                height: 9000,
                type: 'image',
              },
            ],
          }
          jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync').mockResolvedValue(imageResult)

          const { result } = renderHook(useMediaLibraryImagePicker)

          const pickImageResult = await result.current.pickImages({
            type: 'reject',
            limitBytes: 8 * 1024 * 1024,
          })
          expect(pickImageResult).toStrictEqual(imageResult)
        })
      })
    })
  })
})
