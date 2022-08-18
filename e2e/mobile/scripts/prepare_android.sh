#!/usr/bin/env sh
trap '' EXIT INT TERM
trap "echo 'stopping all' && kill 0" EXIT

echo 'staring or connecting to emulator...'
./scripts/run_android_emulator.sh &

echo 'starting appium...'
npx appium &

echo 'starting local env...'
HOLI_API_URL=https://staging.unified.apis.project-holi.org/graphql yarn workspace @holi/mobile android