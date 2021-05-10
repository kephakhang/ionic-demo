# Ionic-Demo App

## Install git,  vscode and git clone source repository
1. git command install : https://git-scm.com/downloads
2. vscode install : https://code.visualstudio.com/download
3. download this source : git clone https://github.com/peterkhang/ionic-demo.git
4. open source folder with vscode
5. vscode terminal setting as git bash : https://murra.tistory.com/36

## Install development environment commands 
1. nodejs, npm 설치 : https://nodejs.org/en/
2. npm command update : $ npm i -g npm (run in vscode terminal)
3. yarn install : $ npm i -g yarn : https://classic.yarnpkg.com/en/docs/install/#mac-stable
4. ionic install : $ npm i -g @ionic/cli
5. angular install : $ npm i -g @angular/cli

## Ionic-Demo build and deploy (run in vscode git bash terminal)
1. $ yarn (build node_modules dependencies in package.json)
2. $ ionic serve (Run to show thid demo on Browser like chrome)
3. $ ionic build --prod (build and deploy public web root folder : ./www)
4. $ npx add android (create android app project)
5. $ npx cap sync (apply ./www & native plugins to android project)
6. $ cd androidReal ; chmod 755 copy.sh(only one time) ; ./copy.sh (copy 5. from android to androidReal project)

## Ionic-Demo Android App Build
1. AndroidStudio Install : https://developer.android.com/studio?gclid=CjwKCAjwkN6EBhBNEiwADVfyaxeWTdfiBIcRzZ6DutxRH6iriW2vCt33BFg9ENhuA3axvaROgiHqaBoCN04QAvD_BwE&gclsrc=aw.ds
2. AndroidStudio SDK previous version install : https://developer.android.com/about/versions/10/setup-sdk?hl=ko (recommendation to install android sdk build-tools version from 30 to 27)
3. android phone debug mode enable setting : https://www.samsung.com/in/support/mobile-devices/what-is-usb-debugging-in-samsung-smartphones/
4. insert phone to PC's usb
5. AndroidStudio open the androidReal project folder
6. Build and Run (with debug or release)
7. Now you can see this demo app on your android phone


## Refereces
ionic framework : https://ionicframework.com/
peerjs : https://www.npmjs.com/package/peerjs
peerjs-server: https://github.com/peers/peerjs-server
