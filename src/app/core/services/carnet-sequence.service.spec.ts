import { TestBed } from '@angular/core/testing';

import { CarnetSequenceService } from './carnet-sequence.service';

describe('CarnetSequenceService', () => {
  let service: CarnetSequenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarnetSequenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
