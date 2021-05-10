import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictationPage } from './dictation';

describe('DictationPage', () => {
  let component: DictationPage;
  let fixture: ComponentFixture<DictationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DictationPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
