import { TestBed } from '@angular/core/testing';

import { ServiceDetailApi } from './service-detail-api';

describe('ServiceDetailApi', () => {
  let service: ServiceDetailApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDetailApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
