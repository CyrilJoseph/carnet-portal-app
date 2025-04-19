import { TestBed } from '@angular/core/testing';

import { CarnetFeeService } from './carnet-fee.service';

describe('CarnetFeeService', () => {
  let service: CarnetFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarnetFeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
