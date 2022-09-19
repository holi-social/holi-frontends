#!/usr/bin/env sh

# Requirements:
# - Android studio incl. tools in version >= 28:
#   In Android Studio, under Settings > Appearance & Behavior > System Settings > Android SDK > SDK Tools
#   make sure to use the newest versions for
#   - Android SDK Build-Tools
#   - Android SDK Platform-Tools
#   - Android SDK Tools
# - Setup ANDROID_HOME in $PROJECT_ROOT/.envrc.local (example in .envrc.local.template)
# - If you want to use your own emulator, adjust E2E_ANDROID_VIRTUAL_DEVICE_NAME accordingly (in .envrc.local)

set -eux

PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$PATH
export PATH

# Android PIE (9.0) API 28, oldest version with (currently) above 10% market share 
AVD_PACKAGE='system-images;android-28;google_apis;x86'

NEW_AVD=0

echo "checking if device is connected..."
if adb get-state 1>/dev/null 2>&1
then
  echo 'device connected'
else
  echo 'no device connected'

  echo "checking if emulator $E2E_ANDROID_VIRTUAL_DEVICE_NAME exists..."
  if avdmanager list avds | grep "$E2E_ANDROID_VIRTUAL_DEVICE_NAME" 1>/dev/null 2>&1
  then
    echo "emulator $E2E_ANDROID_VIRTUAL_DEVICE_NAME exists"
  else
    echo "emulator $E2E_ANDROID_VIRTUAL_DEVICE_NAME does not exist"

    echo "creating emulator $E2E_ANDROID_VIRTUAL_DEVICE_NAME..."
    yes | sdkmanager --install $AVD_PACKAGE
    yes no | avdmanager create avd --force --name "$E2E_ANDROID_VIRTUAL_DEVICE_NAME" --abi google_apis/x86 --package $AVD_PACKAGE
    NEW_AVD=1
    echo "finished creating emulator $E2E_ANDROID_VIRTUAL_DEVICE_NAME"
  fi

  echo "starting emulator $E2E_ANDROID_VIRTUAL_DEVICE_NAME..."
  emulator @"$E2E_ANDROID_VIRTUAL_DEVICE_NAME" -skin 1080x2340 &

  if $NEW_AVD
  then
    echo "checking if emulator is connected..."
    sleep 15
    # TODO(SF) wait longer / check in loop?
    if adb get-state 1>/dev/null 2>&1
    then
      echo 'emulator connected'

      echo 'installing Expo Go on emulator...'
      expo client:install:android --latest
      echo 'finished installing Expo Go on emulator'
    else
      echo 'connecting to emulator failed'
      exit 1
    fi
  fi
fi
