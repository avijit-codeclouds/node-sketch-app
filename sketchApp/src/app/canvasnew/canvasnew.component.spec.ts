import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasnewComponent } from './canvasnew.component';

describe('CanvasnewComponent', () => {
  let component: CanvasnewComponent;
  let fixture: ComponentFixture<CanvasnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
