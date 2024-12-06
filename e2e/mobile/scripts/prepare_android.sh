#!/usr/bin/env sh

set -eux

trap '' EXIT INT TERM
trap "echo 'stopping all' && kill 0" EXIT

echo 'starting or connecting to emulator...'
./scripts/run_android_emulator.sh &

echo 'You should start your local env using mprocs'

echo 'starting appium...'
yarn appium -p ${APPIUM_PORT:-4723} --base-path ${APPIUM_PATH:-/}
