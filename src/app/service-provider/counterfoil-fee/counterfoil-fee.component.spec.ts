import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterfoilFeeComponent } from './counterfoil-fee.component';

describe('CounterfoilFeeComponent', () => {
  let component: CounterfoilFeeComponent;
  let fixture: ComponentFixture<CounterfoilFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterfoilFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounterfoilFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
