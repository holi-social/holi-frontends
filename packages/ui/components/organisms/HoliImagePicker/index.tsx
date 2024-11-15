import React from "react";
import { useTranslation } from "react-i18next";

import { ReactNativeFile } from "@holi/api/graphql/client";
import HoliButton from "@holi/ui/components/molecules/HoliButton";
import {
	HoliToastType,
	useToast,
} from "@holi/ui/components/molecules/HoliToastProvider";

import {
	FileSizeLimitationResize,
	HoliImageInfo,
	HoliImagePickerProps,
} from "./types";
import { useMediaLibraryImagePicker } from "./useMediaLibraryImagePicker";

const HoliImagePicker = ({
	children,
	buttonProps,
	onPickImage,
	onPickImages,
	allowsMultipleSelection,
	fileSizeLimitation,
}: React.PropsWithChildren<HoliImagePickerProps>) => {
	const { pickImages } = useMediaLibraryImagePicker(allowsMultipleSelection);
	const { openToast } = useToast();
	const { t } = useTranslation();

	const pickImageHandler = async () => {
		const imagePickerResult = await pickImages(fileSizeLimitation);

		switch (imagePickerResult) {
			case "technicalError":
				openToast(t("global.imagepicker.failure"), HoliToastType.ERROR);
				return;
			case "invalidFileSize":
				openToast(
					t("filePicker.error.maxFileSize", {
						size:
							(fileSizeLimitation as FileSizeLimitationResize).limitBytes /
							1024 /
							1024,
					}),
					HoliToastType.ERROR,
				);
				return;
			case "missingPermissions":
				openToast(
					t("global.permissions.mediaLibrary.denied"),
					HoliToastType.ERROR,
				);
				return;
			default:
				if (imagePickerResult.canceled) return;
				else {
					// allowsMultipleSelection is false, so we can assume there should only be
					// one asset (using a for loop is the safest option though)
					const images: HoliImageInfo[] = [];
					for (const {
						uri,
						base64,
						height,
						width,
					} of imagePickerResult.assets) {
						const response = await fetch(uri);
						const blob = await response.blob();
						const filename = uri.substring(uri.lastIndexOf("/") + 1);
						const reactNativeFile = new ReactNativeFile({
							uri,
							name: filename,
							type: blob.type,
						});
						images.push({
							uri,
							blob: reactNativeFile,
							base64,
							height,
							width,
							fileBlob: blob,
						});
						if (onPickImage) {
							onPickImage({
								uri,
								blob: reactNativeFile,
								base64,
								height,
								width,
								fileBlob: blob,
							});
						}
					}
					if (onPickImages) {
						onPickImages(images);
					}
				}
		}
	};

	return (
		<HoliButton {...buttonProps} onPress={pickImageHandler}>
			{children}
		</HoliButton>
	);
};

export default HoliImagePicker;

export type { HoliImagePickerProps };
