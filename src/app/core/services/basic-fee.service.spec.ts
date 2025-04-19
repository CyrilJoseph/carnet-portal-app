import { TestBed } from '@angular/core/testing';

import { BasicFeeService } from './basic-fee.service';

describe('BasicFeeService', () => {
  let service: BasicFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicFeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
