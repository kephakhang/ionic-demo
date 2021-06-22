#!/bin/sh

#
# npx cap add electron

ionic build --prod --aot --minifyjs --minifycss --optimizejs
npx cap sync

/bin/rm -rf ./electronReal/app
mv ./electron/app ./electronReal/app
