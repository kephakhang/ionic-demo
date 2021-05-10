import { Injectable } from '@angular/core';
import { ko } from './i18n/ko';
import { en } from './i18n/en';

@Injectable()
export class Message {

    public lang = 'ko' ;
    public langMapArr = {
        ko: ko,
        en: en
    } ;
    constructor() {
    }

    public setLang(newLang) {
        this.lang = newLang;
    }

    public get(nick) {
        return this.langMapArr[this.lang][nick] ;
    }
}
