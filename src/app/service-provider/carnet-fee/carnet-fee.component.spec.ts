import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnetFeeComponent } from './carnet-fee.component';

describe('CarnetFeeComponent', () => {
  let component: CarnetFeeComponent;
  let fixture: ComponentFixture<CarnetFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarnetFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarnetFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
