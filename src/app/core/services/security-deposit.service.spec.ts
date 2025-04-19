import { TestBed } from '@angular/core/testing';

import { SecurityDepositService } from './security-deposit.service';

describe('SecurityDepositService', () => {
  let service: SecurityDepositService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityDepositService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
