#!/usr/bin/env bash

pushd ./src > /dev/null

go run ./build.go

popd > /dev/null
