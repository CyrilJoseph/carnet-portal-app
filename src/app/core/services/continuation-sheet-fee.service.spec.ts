import { TestBed } from '@angular/core/testing';

import { ContinuationSheetFeeService } from './continuation-sheet-fee.service';

describe('ContinuationSheetFeeService', () => {
  let service: ContinuationSheetFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContinuationSheetFeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
