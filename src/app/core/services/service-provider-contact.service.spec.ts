import { TestBed } from '@angular/core/testing';

import { ServiceProviderContactService } from './service-provider-contact.service';

describe('ServiceProviderContactService', () => {
  let service: ServiceProviderContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProviderContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
