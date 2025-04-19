import { TestBed } from '@angular/core/testing';

import { BasicdetailService } from './basicdetail.service';

describe('BasicdetailService', () => {
  let service: BasicdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
