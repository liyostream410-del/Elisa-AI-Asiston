#!/usr/bin/env bash
set -e

ANDROID_SDK_ROOT="$HOME/Android/Sdk"
ANDROID_HOME="$ANDROID_SDK_ROOT"

mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools"

if [ ! -x "$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager" ]; then
  curl -fsSL \
    https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip \
    -o /tmp/cmdline-tools.zip

  rm -rf /tmp/cmdline-tools
  mkdir -p /tmp/cmdline-tools
  unzip -q -o /tmp/cmdline-tools.zip -d /tmp/cmdline-tools

  rm -rf "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  cp -r /tmp/cmdline-tools/cmdline-tools/* \
    "$ANDROID_SDK_ROOT/cmdline-tools/latest/"
fi

export ANDROID_HOME
export ANDROID_SDK_ROOT
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"

yes | sdkmanager --licenses >/dev/null || true

sdkmanager \
  "platform-tools" \
  "platforms;android-36" \
  "build-tools;36.0.0"

echo "Android SDK setup complete."
