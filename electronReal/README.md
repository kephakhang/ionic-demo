This is a ionic demo electron target
1) cd ..

2) ./build.sh  (this is cutom script)

3) cd electronReal

4) vi app/index.html : change base href if you don't see your assets

```<base href="/" /> -> <base href="./" />```

5) electron .   (you can see desktop app run)

6) npm i -g electron@7 ; npm i -g gyp ; npm i -g node-gyp (this step can be skipped if already installed)

7) npm i -g npm-update-all ; npm-update-all (this step can be skipped with npm i)

8) npm run prepare 

9) npm run  build (Now you can see the desktop install package in out/ folder)

10) ionic native plugin will not featured on electron except native plugin supporting electron
