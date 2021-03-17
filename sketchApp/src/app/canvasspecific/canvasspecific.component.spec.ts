import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasspecificComponent } from './canvasspecific.component';

describe('CanvasspecificComponent', () => {
  let component: CanvasspecificComponent;
  let fixture: ComponentFixture<CanvasspecificComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasspecificComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasspecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
