import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnetSequenceComponent } from './carnet-sequence.component';

describe('CarnetSequenceComponent', () => {
  let component: CarnetSequenceComponent;
  let fixture: ComponentFixture<CarnetSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarnetSequenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarnetSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
