#!/usr/bin/env bash

pushd ./src > /dev/null
go run ./build.go tm
popd > /dev/null

npm install
node ./src/tm.js
