#!/bin/sh

/bin/rm -rf app/src/main/assets/public/*
cp -r ../android/app/src/main/assets/public/* app/src/main/assets/public/
