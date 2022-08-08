#!/usr/bin/env sh

# Requirements:
# - Android studio incl. tools in version >= 28:
#   In Android Studio, under Settings > Appearance & Behavior > System Settings > Android SDK > SDK Tools
#   make sure to use the newest versions for
#   - Android SDK Build-Tools
#   - Android SDK Platform-Tools
#   - Android SDK Tools
# - Setup ANDROID_HOME in .envrc.local (example in .envrc.local.template)
# - If you want to use your own emulator, adjust AVD_E2E accordingly (in .envrc.local)

PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$PATH
export PATH

# Android PIE (9.0) API 28
AVD_PACKAGE='system-images;android-28;google_apis;x86'

NEW_AVD=0

echo "checking if device is connected..."
if adb get-state 1>/dev/null 2>&1
then
  echo 'device connected'
else
  echo 'no device connected'

  echo "checking if emulator $AVD_E2E exists..."
  if avdmanager list avds | grep $AVD_E2E 1>/dev/null 2>&1
  then
    echo "emulator $AVD_E2E exists"
  else
    echo "emulator $AVD_E2E does not exist"

    echo "creating emulator $AVD_E2E..."
    sdkmanager --install $AVD_PACKAGE
    avdmanager create avd --force --name $AVD_E2E --abi google_apis/x86 --package $AVD_PACKAGE --device "pixel_5"
    NEW_AVD=1
    echo "finished creating emulator $AVD_E2E"
  fi

  echo "starting emulator $AVD_E2E..."
  emulator @$AVD_E2E -skin 1080x2340 &

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
