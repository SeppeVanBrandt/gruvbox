#!/usr/bin/env bash

pushd ./src > /dev/null

go run ./build.go bat

popd > /dev/null

node ./src/bat.js
