import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KonvastaticComponent } from './konvastatic.component';

describe('KonvastaticComponent', () => {
  let component: KonvastaticComponent;
  let fixture: ComponentFixture<KonvastaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KonvastaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KonvastaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
