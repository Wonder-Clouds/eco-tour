import { TestBed } from '@angular/core/testing';

import { ReserveApi } from './reserve-api';

describe('ReserveApi', () => {
  let service: ReserveApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReserveApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
