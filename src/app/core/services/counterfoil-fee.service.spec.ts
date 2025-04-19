import { TestBed } from '@angular/core/testing';

import { CounterfoilFeeService } from './counterfoil-fee.service';

describe('CounterfoilFeeService', () => {
  let service: CounterfoilFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterfoilFeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
