import { TestBed } from '@angular/core/testing';

import { ExpeditedFeeService } from './expedited-fee.service';

describe('ExpeditedFeeService', () => {
  let service: ExpeditedFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpeditedFeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
