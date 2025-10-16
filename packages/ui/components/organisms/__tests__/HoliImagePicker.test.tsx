jest.mock('expo-file-system/legacy')

import * as ExpoFileSystem from 'expo-file-system/legacy'
import { renderHook } from '@testing-library/react-native'
import * as ExpoImageManipulator from 'expo-image-manipulator'
import * as ExpoImagePicker from 'expo-image-picker'
import { Image } from 'react-native'

import {
  CONTENT_IMAGE_MAX_HEIGHT,
  CONTENT_IMAGE_MAX_WIDTH,
  IMAGE_MAX_FILE_SIZE_BYTES,
} from '@holi/core/constants/constants'
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
        jest.spyOn(Image, 'getSize').mockImplementation((uri, successCallback) => {
          successCallback(6000, 9000)
        })
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
        const mockedBytes = 200 * 1024 * 1024
        jest.spyOn(Image, 'getSize').mockImplementation((uri, successCallback) => {
          successCallback(6000, 9000)
        })
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
          width: CONTENT_IMAGE_MAX_WIDTH,
          height: CONTENT_IMAGE_MAX_HEIGHT,
        }
        const manipulateAsyncMock = jest
          .spyOn(ExpoImageManipulator, 'manipulateAsync')
          .mockResolvedValue(expectedManipulateAsyncParams)

        const { result } = renderHook(useMediaLibraryImagePicker)

        await result.current.pickImages({
          type: 'resize',
          limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
          resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
        })

        expect(manipulateAsyncMock).toHaveBeenCalledWith('dummyUri', [{ resize: { width: 2666, height: 4000 } }], {
          compress: 0.7,
          format: ExpoImageManipulator.SaveFormat.JPEG,
          base64: false,
        })
      })

      it("'resize' value tries to resize image if above limit resolution", async () => {
        const mockedBytes = IMAGE_MAX_FILE_SIZE_BYTES

        jest.spyOn(Image, 'getSize').mockImplementation((uri, successCallback) => {
          successCallback(6000, 9000)
        })
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
          width: CONTENT_IMAGE_MAX_WIDTH,
          height: CONTENT_IMAGE_MAX_HEIGHT,
        }
        const manipulateAsyncMock = jest
          .spyOn(ExpoImageManipulator, 'manipulateAsync')
          .mockResolvedValue(expectedManipulateAsyncParams)

        const { result } = renderHook(useMediaLibraryImagePicker)

        await result.current.pickImages({
          type: 'resize',
          limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
          resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
        })

        expect(manipulateAsyncMock).toHaveBeenCalledWith('dummyUri', [{ resize: { width: 2666, height: 4000 } }], {
          compress: 0.7,
          format: ExpoImageManipulator.SaveFormat.JPEG,
          base64: false,
        })
      })

      it("'resize' value uses CONTENT_IMAGE_MAX_WIDTH if resizeWidth over the given limits", async () => {
        const mockedBytes = IMAGE_MAX_FILE_SIZE_BYTES

        jest.spyOn(Image, 'getSize').mockImplementation((uri, successCallback) => {
          successCallback(6000, 9000)
        })
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
          width: CONTENT_IMAGE_MAX_WIDTH,
          height: CONTENT_IMAGE_MAX_HEIGHT,
        }
        const manipulateAsyncMock = jest
          .spyOn(ExpoImageManipulator, 'manipulateAsync')
          .mockResolvedValue(expectedManipulateAsyncParams)

        const { result } = renderHook(useMediaLibraryImagePicker)

        await result.current.pickImages({
          type: 'resize',
          limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
          resizeWidth: CONTENT_IMAGE_MAX_WIDTH + 1,
        })

        expect(manipulateAsyncMock).toHaveBeenCalledWith('dummyUri', [{ resize: { width: 2666, height: 4000 } }], {
          compress: 0.7,
          format: ExpoImageManipulator.SaveFormat.JPEG,
          base64: false,
        })
      })

      it("'resize' value does not resize image if below of (or equal to) limit", async () => {
        const mockedBytes = IMAGE_MAX_FILE_SIZE_BYTES / 2
        const mockedWidth = CONTENT_IMAGE_MAX_WIDTH / 2
        const mockedHeight = CONTENT_IMAGE_MAX_WIDTH / 2
        jest.spyOn(Image, 'getSize').mockImplementation((uri, successCallback) => {
          successCallback(mockedWidth, mockedHeight)
        })

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
              width: mockedWidth,
              height: mockedHeight,
              type: 'image',
            },
          ],
        }
        jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync').mockResolvedValue(imageResult)
        const manipulateAsyncMock = jest.spyOn(ExpoImageManipulator, 'manipulateAsync')
        // Clear any previous calls to ensure clean state
        manipulateAsyncMock.mockClear()

        const { result } = renderHook(useMediaLibraryImagePicker)

        await result.current.pickImages({
          type: 'resize',
          limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
          resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
        })

        expect(manipulateAsyncMock).toHaveBeenCalled()
      })

      describe("'reject' value", () => {
        it('rejects image if image size is above `limitBytes`', async () => {
          const mockedBytes = IMAGE_MAX_FILE_SIZE_BYTES + 1
          const mockedWidth = CONTENT_IMAGE_MAX_WIDTH
          const mockedHeight = CONTENT_IMAGE_MAX_HEIGHT
          jest.spyOn(Image, 'getSize').mockImplementation((uri, successCallback) => {
            successCallback(mockedWidth, mockedHeight)
          })

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

          const pickImageResult = await result.current.pickImages({
            type: 'reject',
            limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
          })
          expect(pickImageResult).toBe('invalidFileSize')
        })

        it('returns original image result if image pass `limitBytes` and resolution pass conditions', async () => {
          const mockedWidth = CONTENT_IMAGE_MAX_WIDTH
          const mockedHeight = CONTENT_IMAGE_MAX_HEIGHT
          jest.spyOn(Image, 'getSize').mockImplementation((uri, successCallback) => {
            successCallback(mockedWidth, mockedHeight)
          })

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
            size: 1 * 1024, // smaller size
            isDirectory: false,
            modificationTime: 100000,
          })
          const imageResult: ExpoImagePicker.ImagePickerResult = {
            canceled: false,
            assets: [
              {
                uri: 'dummyUri',
                assetId: '123',
                width: mockedWidth,
                height: mockedHeight,
                type: 'image',
              },
            ],
          }
          jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync').mockResolvedValue(imageResult)

          const { result } = renderHook(useMediaLibraryImagePicker)

          const pickImageResult = await result.current.pickImages({
            type: 'reject',
            limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
          })
          expect(pickImageResult).toStrictEqual(imageResult)
        })
      })
    })
  })
})
